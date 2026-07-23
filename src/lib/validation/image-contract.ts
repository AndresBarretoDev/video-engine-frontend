/**
 * OP Video Engine — Immutable Frontend Artifact Contract (F4, PR-F03)
 *
 * Pure validators for the owner-built image: frozen pnpm inputs, standalone
 * Next.js output, non-root runtime, immutable candidate identity, and a
 * minimal public build-info response. Never builds or publishes an image —
 * that remains owner-run outside these validators.
 */

export interface ImageBuildInput {
  sha: string;
  apiUrl: string;
  installCommand: string;
  dockerfileContent: string;
  dockerignoreContent: string;
}

export const CANDIDATE_SHA_PATTERN = /^[0-9a-f]{40}$/;
const FROZEN_INSTALL_FLAG = '--frozen-lockfile';
const REQUIRED_IGNORED_PATHS = [
  'node_modules',
  '.git',
  '.next',
  'tests',
  '.env'
];
const REQUIRED_BUILD_ARGS = ['BUILD_SHA', 'NEXT_PUBLIC_API_URL'];

export function validateCandidateSha(sha: string): string[] {
  return !sha || !CANDIDATE_SHA_PATTERN.test(sha)
    ? ['Candidate SHA must be a well-formed 40-character hex commit SHA']
    : [];
}

export function validateApiTarget(apiUrl: string): string[] {
  if (!apiUrl) return ['Owner-supplied API target URL is required'];
  try {
    const parsed = new URL(apiUrl);
    return ['http:', 'https:'].includes(parsed.protocol)
      ? []
      : ['API target URL must use http or https'];
  } catch {
    return ['API target URL must be a well-formed URL'];
  }
}

export function validateFrozenInstall(installCommand: string): string[] {
  return installCommand.includes(FROZEN_INSTALL_FLAG)
    ? []
    : [
        `Image build must use a frozen lockfile install ("${FROZEN_INSTALL_FLAG}")`
      ];
}

export function validateDockerfileStages(dockerfileContent: string): string[] {
  const stages = dockerfileContent.match(/^FROM\s+\S+\s+AS\s+\S+/gim) ?? [];
  return stages.length >= 2
    ? []
    : [
        'Dockerfile must declare a multi-stage build (builder + runtime stages)'
      ];
}

export function validateDockerfileNonRootRuntime(
  dockerfileContent: string
): string[] {
  const users = [...dockerfileContent.matchAll(/^USER\s+(\S+)/gim)].map(
    m => m[1]
  );
  const lastUser = users[users.length - 1];
  return !lastUser || lastUser === 'root' || lastUser === '0'
    ? ['Dockerfile runtime stage must declare a non-root USER']
    : [];
}

export function validateDockerfileStandaloneOutput(
  dockerfileContent: string
): string[] {
  return dockerfileContent.includes('.next/standalone')
    ? []
    : [
        'Dockerfile must copy the Next.js standalone output (next.config output: "standalone")'
      ];
}

export function validateDockerfileBuildArgs(
  dockerfileContent: string
): string[] {
  return REQUIRED_BUILD_ARGS.filter(
    name => !new RegExp(`^ARG\\s+${name}\\s*$`, 'm').test(dockerfileContent)
  ).map(
    name =>
      `Dockerfile must declare "ARG ${name}" as owner-supplied build identity`
  );
}

export function validateDockerignoreContract(
  dockerignoreContent: string
): string[] {
  const lines = dockerignoreContent.split('\n').map(line => line.trim());
  return REQUIRED_IGNORED_PATHS.filter(
    path => !lines.some(line => line === path || line === `${path}/`)
  ).map(
    path => `.dockerignore must exclude "${path}" to bound the build context`
  );
}

export function validateBuildInfoResponse(
  response: Record<string, unknown>
): string[] {
  const errors: string[] = [];
  const allowed = new Set(['sha', 'version']);
  for (const key of Object.keys(response)) {
    if (!allowed.has(key))
      errors.push(`build-info response must not expose "${key}"`);
  }
  if (
    typeof response.sha !== 'string' ||
    !CANDIDATE_SHA_PATTERN.test(response.sha)
  )
    errors.push('build-info sha must be a well-formed commit SHA');
  if (typeof response.version !== 'string' || response.version === '')
    errors.push('build-info version must be a non-empty string');
  return errors;
}

export function validateImageBuildInput(input: ImageBuildInput): string[] {
  return [
    ...validateCandidateSha(input.sha),
    ...validateApiTarget(input.apiUrl),
    ...validateFrozenInstall(input.installCommand),
    ...validateDockerfileStages(input.dockerfileContent),
    ...validateDockerfileNonRootRuntime(input.dockerfileContent),
    ...validateDockerfileStandaloneOutput(input.dockerfileContent),
    ...validateDockerfileBuildArgs(input.dockerfileContent),
    ...validateDockerignoreContract(input.dockerignoreContent)
  ];
}
