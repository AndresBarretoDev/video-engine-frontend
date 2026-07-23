import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  validateApiTarget,
  validateBuildInfoResponse,
  validateCandidateSha,
  validateDockerfileBuildArgs,
  validateDockerfileNonRootRuntime,
  validateDockerfileStages,
  validateDockerfileStandaloneOutput,
  validateDockerignoreContract,
  validateFrozenInstall,
  validateImageBuildInput,
  type ImageBuildInput
} from './image-contract';

const repositoryRoot = resolve(__dirname, '../../..');
const readRepositoryFile = (path: string) =>
  readFileSync(resolve(repositoryRoot, path), 'utf8');

const VALID_SHA = 'a'.repeat(40);
const VALID_INPUT: ImageBuildInput = {
  sha: VALID_SHA,
  apiUrl: 'https://api.staging.example.com',
  installCommand: 'pnpm install --frozen-lockfile',
  dockerfileContent: readRepositoryFile('Dockerfile'),
  dockerignoreContent: readRepositoryFile('.dockerignore')
};

describe('image build identity', () => {
  it('accepts a well-formed candidate SHA', () => {
    expect(validateCandidateSha(VALID_SHA)).toEqual([]);
  });

  it.each(['', 'not-a-sha', 'A'.repeat(40), 'a'.repeat(39)])(
    'rejects malformed SHA %j',
    sha => {
      expect(validateCandidateSha(sha)).not.toEqual([]);
    }
  );

  it('accepts a well-formed API target URL', () => {
    expect(validateApiTarget('https://api.staging.example.com')).toEqual([]);
  });

  it.each(['', 'not-a-url', 'ftp://api.example.com'])(
    'rejects malformed API target %j',
    apiUrl => {
      expect(validateApiTarget(apiUrl)).not.toEqual([]);
    }
  );
});

describe('image lock and build context', () => {
  it('accepts a frozen-lockfile install command', () => {
    expect(validateFrozenInstall('pnpm install --frozen-lockfile')).toEqual([]);
  });

  it('rejects a mutable lock install command', () => {
    expect(validateFrozenInstall('pnpm install')).toContain(
      'Image build must use a frozen lockfile install ("--frozen-lockfile")'
    );
  });

  it('rejects an excessive build context missing required ignores', () => {
    expect(validateDockerignoreContract('*.png\n')).toEqual(
      expect.arrayContaining([
        '.dockerignore must exclude "node_modules" to bound the build context',
        '.dockerignore must exclude ".git" to bound the build context'
      ])
    );
  });

  it('accepts the real .dockerignore contract', () => {
    expect(
      validateDockerignoreContract(VALID_INPUT.dockerignoreContent)
    ).toEqual([]);
  });
});

describe('image runtime and build args', () => {
  it('rejects a root runtime user', () => {
    expect(
      validateDockerfileNonRootRuntime('FROM node:22-alpine\nUSER root\n')
    ).toContain('Dockerfile runtime stage must declare a non-root USER');
  });

  it('rejects a missing runtime user', () => {
    expect(validateDockerfileNonRootRuntime('FROM node:22-alpine\n')).toContain(
      'Dockerfile runtime stage must declare a non-root USER'
    );
  });

  it('rejects a single-stage Dockerfile', () => {
    expect(
      validateDockerfileStages('FROM node:22-alpine\nRUN echo hi\n')
    ).toContain(
      'Dockerfile must declare a multi-stage build (builder + runtime stages)'
    );
  });

  it('rejects a Dockerfile missing the standalone output copy', () => {
    expect(
      validateDockerfileStandaloneOutput('FROM node:22-alpine\n')
    ).toContain(
      'Dockerfile must copy the Next.js standalone output (next.config output: "standalone")'
    );
  });

  it('rejects missing owner identity build args', () => {
    expect(validateDockerfileBuildArgs('FROM node:22-alpine\n')).toEqual(
      expect.arrayContaining([
        'Dockerfile must declare "ARG BUILD_SHA" as owner-supplied build identity',
        'Dockerfile must declare "ARG NEXT_PUBLIC_API_URL" as owner-supplied build identity'
      ])
    );
  });

  it('accepts the real Dockerfile contract', () => {
    expect(
      validateDockerfileNonRootRuntime(VALID_INPUT.dockerfileContent)
    ).toEqual([]);
    expect(validateDockerfileStages(VALID_INPUT.dockerfileContent)).toEqual([]);
    expect(
      validateDockerfileStandaloneOutput(VALID_INPUT.dockerfileContent)
    ).toEqual([]);
    expect(validateDockerfileBuildArgs(VALID_INPUT.dockerfileContent)).toEqual(
      []
    );
  });
});

describe('build-info response contract', () => {
  it('accepts a minimal sha/version response', () => {
    expect(
      validateBuildInfoResponse({ sha: VALID_SHA, version: '0.1.0' })
    ).toEqual([]);
  });

  it('rejects any field beyond sha/version', () => {
    expect(
      validateBuildInfoResponse({
        sha: VALID_SHA,
        version: '0.1.0',
        apiUrl: 'https://internal.example.com'
      })
    ).toContain('build-info response must not expose "apiUrl"');
  });

  it('rejects a malformed sha or empty version', () => {
    expect(
      validateBuildInfoResponse({ sha: 'not-a-sha', version: '' })
    ).toEqual(
      expect.arrayContaining([
        'build-info sha must be a well-formed commit SHA',
        'build-info version must be a non-empty string'
      ])
    );
  });
});

describe('full image build input contract', () => {
  it('accepts the real repository Dockerfile/.dockerignore with valid identity', () => {
    expect(validateImageBuildInput(VALID_INPUT)).toEqual([]);
  });

  it('fails before publish on any unsafe input', () => {
    expect(validateImageBuildInput({ ...VALID_INPUT, sha: '' })).not.toEqual(
      []
    );
    expect(validateImageBuildInput({ ...VALID_INPUT, apiUrl: '' })).not.toEqual(
      []
    );
    expect(
      validateImageBuildInput({
        ...VALID_INPUT,
        installCommand: 'pnpm install'
      })
    ).not.toEqual([]);
    expect(
      validateImageBuildInput({
        ...VALID_INPUT,
        dockerfileContent: 'FROM node:22-alpine\nUSER root\n'
      })
    ).not.toEqual([]);
  });
});
