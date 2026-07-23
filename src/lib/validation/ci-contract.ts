/**
 * OP Video Engine — Owner-Dispatched CI Contract (F4, PR-F03)
 *
 * Pure validators over the raw `.github/workflows/frontend-ci.yml` text.
 * String/line based (no YAML parser dependency) — mirrors the repo's
 * existing check-contract.test.ts style of exact-content assertions.
 */

const REQUIRED_FIXED_COMMANDS = [
  'pnpm install --frozen-lockfile',
  'pnpm run format:check',
  'pnpm run lint:check',
  'pnpm run type:check',
  'pnpm run test:unit'
];

export function extractJobBlock(workflowYaml: string, jobName: string): string {
  const lines = workflowYaml.split('\n');
  const startIndex = lines.findIndex(line =>
    new RegExp(`^ {2}${jobName}:\\s*$`).test(line)
  );
  if (startIndex === -1) return '';
  const rest = lines.slice(startIndex + 1);
  const endOffset = rest.findIndex(line => /^ {2}\S/.test(line));
  return (endOffset === -1 ? rest : rest.slice(0, endOffset)).join('\n');
}

export function validateNoInjectedCommands(workflowYaml: string): string[] {
  return workflowYaml
    .split('\n')
    .filter(
      line => /run:\s*/.test(line) && /\$\{\{\s*github\.event\./.test(line)
    )
    .map(
      line => `Unsafe untrusted interpolation in run command: "${line.trim()}"`
    );
}

export function validateFixedCommands(workflowYaml: string): string[] {
  return REQUIRED_FIXED_COMMANDS.filter(
    command => !workflowYaml.includes(command)
  ).map(command => `Workflow must run fixed repo-local command "${command}"`);
}

export function validateJobNeeds(
  workflowYaml: string,
  jobName: string,
  required: string[]
): string[] {
  const block = extractJobBlock(workflowYaml, jobName);
  if (!block) return [`Job "${jobName}" is missing`];

  const inline = block.match(/needs:\s*\[([^\]]*)\]/);
  const list = block.match(/needs:\s*\n((?:\s*-\s*\S+\n?)+)/);
  const declared = (inline?.[1] ?? list?.[1] ?? '')
    .split(/[,\n]/)
    .map(item => item.replace(/-/g, '').trim())
    .filter(Boolean);

  return required
    .filter(need => !declared.includes(need))
    .map(
      need => `Job "${jobName}" must declare a blocking dependency on "${need}"`
    );
}

export function validateJobTimeout(
  workflowYaml: string,
  jobName: string,
  maxMinutes: number
): string[] {
  const block = extractJobBlock(workflowYaml, jobName);
  if (!block) return [`Job "${jobName}" is missing`];

  const match = block.match(/timeout-minutes:\s*(\d+)/);
  if (!match)
    return [`Job "${jobName}" must declare a bounded timeout-minutes`];
  const minutes = Number(match[1]);
  return minutes > 0 && minutes <= maxMinutes
    ? []
    : [`Job "${jobName}" timeout-minutes must be bounded (1-${maxMinutes})`];
}

export function validateConcurrency(workflowYaml: string): string[] {
  const errors: string[] = [];
  if (!/^concurrency:/m.test(workflowYaml))
    errors.push('Workflow must declare a top-level concurrency group');
  if (!/cancel-in-progress:\s*true/.test(workflowYaml))
    errors.push(
      'Concurrency must set cancel-in-progress: true (cancellation never promotes)'
    );
  if (!/group:\s*.*\$\{\{\s*github\.ref\s*\}\}/.test(workflowYaml))
    errors.push(
      'Concurrency group must be scoped per ref to prevent cross-SHA promotion'
    );
  return errors;
}

export function validateCleanupRetention(
  workflowYaml: string,
  maxRetentionDays: number
): string[] {
  const matches = [...workflowYaml.matchAll(/retention-days:\s*(\d+)/g)];
  if (matches.length === 0)
    return ['Workflow must declare bounded artifact retention-days'];
  return matches
    .filter(
      match => Number(match[1]) > maxRetentionDays || Number(match[1]) <= 0
    )
    .map(() => `retention-days must be bounded (1-${maxRetentionDays})`);
}

export function validateStagingGate(workflowYaml: string): string[] {
  const block = extractJobBlock(workflowYaml, 'staging-gate');
  if (!block) return ['Workflow must declare a staging-gate job'];
  return /if:\s*.*success\(\)/.test(block)
    ? []
    : [
        'staging-gate must only run on upstream success() (never on failure/cancel/skip)'
      ];
}

export function validateSharedCandidateIdentity(
  workflowYaml: string
): string[] {
  const shaExpression = /NEXT_PUBLIC_BUILD_SHA:\s*(.+)/;
  const buildSha = extractJobBlock(workflowYaml, 'build')
    .match(shaExpression)?.[1]
    ?.trim();
  const stagingSha = extractJobBlock(workflowYaml, 'staging-gate')
    .match(shaExpression)?.[1]
    ?.trim();

  if (!buildSha || !stagingSha)
    return [
      'build and staging-gate must both bind NEXT_PUBLIC_BUILD_SHA to one candidate identity'
    ];
  return buildSha === stagingSha
    ? []
    : [
        'build and staging-gate reference different candidate SHA expressions — cross-SHA promotion is blocked'
      ];
}

const DISPATCH_GUARD = /if:\s*.*github\.event_name\s*==\s*'workflow_dispatch'/;
export function validateOwnerDispatchGate(
  workflowYaml: string,
  jobNames: string[]
): string[] {
  return jobNames
    .filter(job => !DISPATCH_GUARD.test(extractJobBlock(workflowYaml, job)))
    .map(job => `Job "${job}" must be gated to run only on workflow_dispatch`);
}

export function validatePermissions(workflowYaml: string): string[] {
  const match = workflowYaml.match(/^permissions:\n((?:\s+.+\n?)+)/m);
  if (!match) return ['Workflow must declare a top-level permissions block'];
  return /write-all|:\s*write\b/.test(match[1])
    ? ['Workflow permissions must be least-privilege (no write access)']
    : [];
}

export function validateCandidateShaCheckout(
  workflowYaml: string,
  jobName: string
): string[] {
  const [, after = ''] =
    extractJobBlock(workflowYaml, jobName).match(
      /uses:\s*actions\/checkout@v4\n((?:\s{8,}.+\n?)*)/
    ) ?? [];
  return /ref:\s*.*candidate_sha/.test(after)
    ? []
    : [`Job "${jobName}" checkout must pin ref to the candidate_sha input`];
}

export function validateWorkflowContract(workflowYaml: string): string[] {
  return [
    ...validateNoInjectedCommands(workflowYaml),
    ...validateFixedCommands(workflowYaml),
    ...validateJobNeeds(workflowYaml, 'build', ['checks']),
    ...validateJobNeeds(workflowYaml, 'staging-gate', ['build']),
    ...validateJobTimeout(workflowYaml, 'checks', 15),
    ...validateJobTimeout(workflowYaml, 'build', 20),
    ...validateJobTimeout(workflowYaml, 'staging-gate', 30),
    ...validateConcurrency(workflowYaml),
    ...validateCleanupRetention(workflowYaml, 7),
    ...validateStagingGate(workflowYaml),
    ...validateSharedCandidateIdentity(workflowYaml),
    ...validateOwnerDispatchGate(workflowYaml, ['build', 'staging-gate']),
    ...validatePermissions(workflowYaml),
    ...validateCandidateShaCheckout(workflowYaml, 'build'),
    ...validateCandidateShaCheckout(workflowYaml, 'staging-gate')
  ];
}
