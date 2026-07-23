import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  validateCleanupRetention,
  validateConcurrency,
  validateFixedCommands,
  validateJobNeeds,
  validateJobTimeout,
  validateNoInjectedCommands,
  validateSharedCandidateIdentity,
  validateStagingGate,
  validateWorkflowContract
} from './ci-contract';

const repositoryRoot = resolve(__dirname, '../../..');
const realWorkflow = readFileSync(
  resolve(repositoryRoot, '.github/workflows/frontend-ci.yml'),
  'utf8'
);

describe('composed/untrusted command rejection', () => {
  it('rejects a run: step that interpolates untrusted event input', () => {
    expect(
      validateNoInjectedCommands(
        'jobs:\n  build:\n    steps:\n      - run: echo ${{ github.event.pull_request.title }}\n'
      )
    ).not.toEqual([]);
  });

  it('accepts identity passed through env instead of an inline shell command', () => {
    expect(
      validateNoInjectedCommands(
        'jobs:\n  build:\n    steps:\n      - run: pnpm run build\n        env:\n          SHA: ${{ github.event.inputs.candidate_sha }}\n'
      )
    ).toEqual([]);
  });

  it('accepts the real workflow with no injected commands', () => {
    expect(validateNoInjectedCommands(realWorkflow)).toEqual([]);
  });
});

describe('absent dependencies and cross-SHA partial success', () => {
  it('rejects a build job missing the checks dependency', () => {
    const yaml = 'jobs:\n  build:\n    runs-on: ubuntu-latest\n';
    expect(validateJobNeeds(yaml, 'build', ['checks'])).toContain(
      'Job "build" must declare a blocking dependency on "checks"'
    );
  });

  it('rejects a missing job entirely', () => {
    expect(validateJobNeeds('jobs:\n', 'build', ['checks'])).toContain(
      'Job "build" is missing'
    );
  });

  it('rejects cross-SHA partial success between build and staging-gate', () => {
    const yaml =
      'jobs:\n' +
      '  build:\n' +
      '    steps:\n' +
      '      - run: pnpm run build\n' +
      '        env:\n' +
      '          NEXT_PUBLIC_BUILD_SHA: ${{ github.sha }}\n' +
      '  staging-gate:\n' +
      '    steps:\n' +
      '      - run: pnpm exec playwright test\n' +
      '        env:\n' +
      '          NEXT_PUBLIC_BUILD_SHA: ${{ github.event.inputs.candidate_sha }}\n';
    expect(validateSharedCandidateIdentity(yaml)).not.toEqual([]);
  });

  it('accepts the real workflow blocking dependencies and shared identity', () => {
    expect(validateJobNeeds(realWorkflow, 'build', ['checks'])).toEqual([]);
    expect(validateJobNeeds(realWorkflow, 'staging-gate', ['build'])).toEqual(
      []
    );
    expect(validateSharedCandidateIdentity(realWorkflow)).toEqual([]);
  });
});

describe('cancellation-safe no-promotion', () => {
  it('rejects a staging-gate job missing an upstream success() guard', () => {
    const yaml = 'jobs:\n  staging-gate:\n    needs: [build]\n';
    expect(validateStagingGate(yaml)).toContain(
      'staging-gate must only run on upstream success() (never on failure/cancel/skip)'
    );
  });

  it('accepts the real workflow staging-gate guard', () => {
    expect(validateStagingGate(realWorkflow)).toEqual([]);
  });
});

describe('bounded concurrency, timeouts, cleanup, and retention', () => {
  it('rejects a workflow with no concurrency group', () => {
    expect(validateConcurrency('name: x\n')).toEqual(
      expect.arrayContaining([
        'Workflow must declare a top-level concurrency group'
      ])
    );
  });

  it('rejects an unbounded or missing job timeout', () => {
    const yaml = 'jobs:\n  checks:\n    runs-on: ubuntu-latest\n';
    expect(validateJobTimeout(yaml, 'checks', 15)).not.toEqual([]);
    expect(
      validateJobTimeout(
        'jobs:\n  checks:\n    timeout-minutes: 999\n',
        'checks',
        15
      )
    ).not.toEqual([]);
  });

  it('rejects missing or excessive artifact retention', () => {
    expect(validateCleanupRetention('name: x\n', 7)).toEqual([
      'Workflow must declare bounded artifact retention-days'
    ]);
    expect(validateCleanupRetention('retention-days: 90\n', 7)).not.toEqual([]);
  });

  it('accepts the real workflow concurrency, timeouts, and retention', () => {
    expect(validateConcurrency(realWorkflow)).toEqual([]);
    expect(validateJobTimeout(realWorkflow, 'checks', 15)).toEqual([]);
    expect(validateJobTimeout(realWorkflow, 'build', 20)).toEqual([]);
    expect(validateJobTimeout(realWorkflow, 'staging-gate', 30)).toEqual([]);
    expect(validateCleanupRetention(realWorkflow, 7)).toEqual([]);
  });
});

describe('fixed repo-local commands', () => {
  it('rejects a workflow missing a required named check command', () => {
    expect(validateFixedCommands('run: pnpm run lint:check\n')).toEqual(
      expect.arrayContaining([
        'Workflow must run fixed repo-local command "pnpm install --frozen-lockfile"',
        'Workflow must run fixed repo-local command "pnpm run type:check"'
      ])
    );
  });

  it('accepts the real workflow fixed commands', () => {
    expect(validateFixedCommands(realWorkflow)).toEqual([]);
  });
});

describe('full workflow contract', () => {
  it('the real .github/workflows/frontend-ci.yml passes every rule', () => {
    expect(validateWorkflowContract(realWorkflow)).toEqual([]);
  });
});
