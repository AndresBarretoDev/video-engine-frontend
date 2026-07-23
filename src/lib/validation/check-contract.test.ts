import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

type PackageContract = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  engines?: { node?: string };
  packageManager?: string;
  pnpm?: { overrides?: Record<string, string> };
  scripts?: Record<string, string>;
};

const repositoryRoot = resolve(__dirname, '../../..');

const readRepositoryFile = (path: string) =>
  readFileSync(resolve(repositoryRoot, path), 'utf8').trim();

const validateRuntime = (
  nodeVersion: string,
  packageContract: PackageContract,
  lockfile: string
) => {
  const errors: string[] = [];
  const packageManager = packageContract.packageManager ?? '';
  const importer = lockfile.split('\npackages:')[0];

  if (!/^22\.\d+\.\d+$/.test(nodeVersion))
    errors.push('Node must be pinned to Node 22');
  if (packageContract.engines?.node !== '22.x')
    errors.push('engines.node must be 22.x');
  if (packageManager !== 'pnpm@10.15.1')
    errors.push('pnpm must be pinned to 10.15.1');
  if (!lockfile.includes("lockfileVersion: '9.0'"))
    errors.push('pnpm lockfile metadata is missing');

  for (const dependency of ['@playwright/test', '@axe-core/playwright']) {
    const version = packageContract.devDependencies?.[dependency];
    if (packageContract.dependencies?.[dependency] && version) {
      errors.push(`${dependency} must be declared exactly once`);
    }
    if (!version || !importer.includes(`      '${dependency}':`)) {
      errors.push(`${dependency} must be declared and locked`);
    }
  }

  return errors;
};

const focusedScripts = [
  'format:check',
  'lint:check',
  'type:check',
  'test:unit'
] as const;
const validScripts = {
  'format:check':
    'prettier --check package.json eslint.config.mjs vitest.config.ts src/lib/validation/check-contract.test.ts ops/production-validation.md',
  'lint:check': 'eslint src/lib/validation/check-contract.test.ts',
  'type:check': 'tsc --noEmit --incremental false',
  'test:unit': 'vitest run',
  'check:ci': focusedScripts.map(name => `pnpm run ${name}`).join(' && ')
};

const runAggregateFixture = (
  aggregate: string,
  failingCheck?: (typeof focusedScripts)[number]
) => {
  const directory = mkdtempSync(resolve(tmpdir(), 'frontend-check-contract-'));
  const scripts = Object.fromEntries(
    focusedScripts.map(name => [
      name,
      name === failingCheck
        ? `node -e "console.error('CHECK_FAILURE:${name}'); process.exit(17)"`
        : `node -e "console.log('CHECK_RAN:${name}')"`
    ])
  );
  scripts['check:ci'] = aggregate;

  try {
    writeFileSync(
      resolve(directory, 'package.json'),
      JSON.stringify({ name: 'check-contract-fixture', private: true, scripts })
    );
    const result = spawnSync('pnpm', ['run', 'check:ci'], {
      cwd: directory,
      encoding: 'utf8'
    });
    return {
      status: result.status ?? 1,
      output: `${result.stdout}${result.stderr}`
    };
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
};

const runFrozenInstallFixture = (duplicateDependency: boolean) => {
  const directory = mkdtempSync(resolve(tmpdir(), 'frontend-frozen-install-'));
  const packageContract = JSON.parse(
    readRepositoryFile('package.json')
  ) as PackageContract;
  if (duplicateDependency) {
    packageContract.dependencies = {
      ...packageContract.dependencies,
      '@playwright/test': '0.0.0'
    };
  }
  const lockfilePath = resolve(directory, 'pnpm-lock.yaml');
  const lockfile = readFileSync(resolve(repositoryRoot, 'pnpm-lock.yaml'));

  try {
    writeFileSync(
      resolve(directory, 'package.json'),
      JSON.stringify(packageContract)
    );
    writeFileSync(lockfilePath, lockfile);
    const lockfileBefore = createHash('sha256').update(lockfile).digest('hex');
    const result = spawnSync(
      'pnpm',
      ['install', '--frozen-lockfile', '--lockfile-only', '--ignore-scripts'],
      { cwd: directory, encoding: 'utf8' }
    );
    const lockfileAfter = createHash('sha256')
      .update(readFileSync(lockfilePath))
      .digest('hex');
    return {
      status: result.status ?? 1,
      output: `${result.stdout}${result.stderr}`,
      lockfileBefore,
      lockfileAfter
    };
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
};

const validateScripts = (scripts: Record<string, string> = {}) => {
  const errors: string[] = [];

  for (const name of focusedScripts) {
    const command = scripts[name];
    if (!command) errors.push(`${name} is missing`);
    else if (/--write|--fix/.test(command))
      errors.push(`${name} must not write files`);
  }

  const aggregate = scripts['check:ci'] ?? '';
  if (!aggregate) errors.push('check:ci is missing');
  else if (aggregate !== validScripts['check:ci'])
    errors.push('check:ci must be the exact fail-fast named-check chain');
  if (/\bbuild\b/.test(aggregate))
    errors.push('check:ci must not run a production build');

  return errors;
};

const metadataDigest = () => {
  const contents = [
    '.nvmrc',
    '.node-version',
    'package.json',
    'pnpm-lock.yaml'
  ].map(readRepositoryFile);
  return createHash('sha256').update(contents.join('\n')).digest('hex');
};

describe('frontend runtime contract', () => {
  it('pins matching Node, pnpm, package, and lock identities', () => {
    const nvmVersion = readRepositoryFile('.nvmrc');
    const nodeVersion = readRepositoryFile('.node-version');
    const packageContract = JSON.parse(
      readRepositoryFile('package.json')
    ) as PackageContract;
    const lockfile = readRepositoryFile('pnpm-lock.yaml');

    expect(nvmVersion).toBe(nodeVersion);
    expect(validateRuntime(nodeVersion, packageContract, lockfile)).toEqual([]);
  });

  it('rejects mismatched runtime fixture metadata', () => {
    expect(
      validateRuntime(
        '20.11.0',
        { engines: { node: '>=20.11.0' }, packageManager: 'pnpm@9.0.0' },
        "lockfileVersion: '8.0'"
      )
    ).toEqual(
      expect.arrayContaining([
        'Node must be pinned to Node 22',
        'engines.node must be 22.x',
        'pnpm must be pinned to 10.15.1',
        'pnpm lockfile metadata is missing',
        '@playwright/test must be declared and locked',
        '@axe-core/playwright must be declared and locked'
      ])
    );
  });

  it('locks patched compatible ESLint transitive overrides', () => {
    const packageContract = JSON.parse(
      readRepositoryFile('package.json')
    ) as PackageContract;
    const lockfile = readRepositoryFile('pnpm-lock.yaml');
    const overrides = packageContract.pnpm?.overrides;

    expect(overrides?.['@eslint/eslintrc>ajv']).toBe('6.14.0');
    expect(overrides?.['eslint>ajv']).toBe('6.14.0');
    expect(overrides?.['@eslint/eslintrc>minimatch']).toBe('3.1.4');
    expect(lockfile).toContain('ajv@6.14.0');
    expect(lockfile).toContain('minimatch@3.1.4');
  });

  it('exposes distinguishable non-writing focused checks', () => {
    const packageContract = JSON.parse(
      readRepositoryFile('package.json')
    ) as PackageContract;

    expect(validateScripts(packageContract.scripts)).toEqual([]);
    expect(packageContract.scripts?.['type:check']).toContain(
      '--incremental false'
    );
  });

  it('identifies the named check that violates the contract', () => {
    expect(
      validateScripts({ ...validScripts, 'lint:check': 'eslint src --fix' })
    ).toContain('lint:check must not write files');
    expect(validateScripts({ ...validScripts, 'type:check': '' })).toContain(
      'type:check is missing'
    );
  });

  it('propagates a named check failure through the aggregate contract', () => {
    const packageContract = JSON.parse(
      readRepositoryFile('package.json')
    ) as PackageContract;
    const result = runAggregateFixture(
      packageContract.scripts?.['check:ci'] ?? '',
      'lint:check'
    );

    expect(result.status).not.toBe(0);
    expect(result.output).toContain('CHECK_FAILURE:lint:check');
    expect(result.output).not.toContain('CHECK_RAN:type:check');
  });

  it('runs every named check when the aggregate contract succeeds', () => {
    const packageContract = JSON.parse(
      readRepositoryFile('package.json')
    ) as PackageContract;
    const result = runAggregateFixture(
      packageContract.scripts?.['check:ci'] ?? ''
    );

    expect(result.status).toBe(0);
    expect(focusedScripts).toHaveLength(4);
    for (const name of focusedScripts) {
      expect(result.output).toContain(`CHECK_RAN:${name}`);
    }
  });

  it('rejects aggregate commands that skip or swallow named checks', () => {
    for (const command of [
      `echo '${validScripts['check:ci']}'`,
      validScripts['check:ci'].replace(' && pnpm run type:check', ''),
      `${validScripts['check:ci']} || true`
    ]) {
      expect(
        validateScripts({
          ...validScripts,
          'check:ci': command
        })
      ).toContain('check:ci must be the exact fail-fast named-check chain');
    }
  });

  it('rejects an undeclared or unlocked package fixture', () => {
    const packageContract = JSON.parse(
      readRepositoryFile('package.json')
    ) as PackageContract;
    const lockfile = readRepositoryFile('pnpm-lock.yaml');
    const dependenciesWithoutAxe = { ...packageContract.devDependencies };
    delete dependenciesWithoutAxe['@axe-core/playwright'];
    const withoutAxe = {
      ...packageContract,
      devDependencies: dependenciesWithoutAxe
    };

    expect(validateRuntime('22.22.3', withoutAxe, lockfile)).toContain(
      '@axe-core/playwright must be declared and locked'
    );
    expect(
      validateRuntime(
        '22.22.3',
        packageContract,
        lockfile.replace("      '@playwright/test':", '')
      )
    ).toContain('@playwright/test must be declared and locked');
  });

  it.each(['@playwright/test', '@axe-core/playwright'])(
    'rejects duplicate %s direct dependency declarations',
    dependency => {
      const packageContract = JSON.parse(
        readRepositoryFile('package.json')
      ) as PackageContract;
      const lockfile = readRepositoryFile('pnpm-lock.yaml');
      const duplicatedDependency = {
        ...packageContract,
        dependencies: {
          ...packageContract.dependencies,
          [dependency]: packageContract.devDependencies?.[dependency] ?? ''
        }
      };

      expect(
        validateRuntime('22.22.3', duplicatedDependency, lockfile)
      ).toContain(`${dependency} must be declared exactly once`);
    }
  );

  it('keeps the lockfile immutable for valid and duplicate frozen installs', () => {
    const valid = runFrozenInstallFixture(false);
    const duplicate = runFrozenInstallFixture(true);

    expect(valid.status).toBe(0);
    expect(valid.lockfileAfter).toBe(valid.lockfileBefore);
    expect(duplicate.status).not.toBe(0);
    expect(duplicate.output).toContain('ERR_PNPM_OUTDATED_LOCKFILE');
    expect(duplicate.lockfileAfter).toBe(duplicate.lockfileBefore);
  });

  it('hands release evidence to F4 as an explicitly pending record', () => {
    const record = readRepositoryFile('ops/production-validation.md');

    expect(record).toContain('Status: `PENDING_F4_EVIDENCE`');
    expect(record).toContain('`frontend-artifact-ci-staging`');
    for (const field of [
      'Candidate SHA',
      'Production build exit',
      '.next/BUILD_ID',
      'Provenance'
    ]) {
      expect(record).toMatch(
        new RegExp(
          `\\| ${field.replace('.', '\\.')}\\s+\\| PENDING_F4_EVIDENCE \\|`
        )
      );
    }
    expect(record).not.toContain('production-validation-context.json');
  });

  it('marks the prior verification report as non-authoritative', () => {
    const report = readRepositoryFile(
      'openspec/changes/archive/2026-07-23-frontend-runtime-check-contract/source/verify-report.md'
    );

    expect(report).toMatch(/^# Superseded Verification Report/);
    expect(report).not.toContain('review-444a48309850ec27');
  });

  it('is stable across repeated, non-writing validation', () => {
    const before = metadataDigest();
    const first = validateScripts(validScripts);
    const second = validateScripts(validScripts);

    expect(first).toEqual(second);
    expect(metadataDigest()).toBe(before);
  });
});
