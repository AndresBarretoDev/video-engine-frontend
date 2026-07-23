import { describe, expect, it } from 'vitest';
import { redactCorrelationId, redactRoute, redactScalar } from './redaction';

describe('redactScalar', () => {
  it.each([
    ['api-client', 'api-client'],
    [{ password: 'p@ss' }, 'unknown'],
    [['secret'], 'unknown'],
    [new Error('leaked-credential-abc123'), 'unknown'],
    ['token=abc123', 'unknown']
  ])('redacts %j to %j', (input, expected) => {
    expect(redactScalar(input)).toBe(expected);
  });

  it('truncates oversized scalars to a bounded length', () => {
    expect(redactScalar('a'.repeat(500)).length).toBeLessThanOrEqual(200);
  });
});

describe('redactRoute', () => {
  it.each([
    ['/dashboard/projects/123', '/dashboard/projects/123'],
    ['/api/render-jobs?token=abc&foo=bar', '/api/render-jobs'],
    ['https://user:pass@example.com/path?x=1', 'unknown'],
    ['http://localhost:3001/api/projects', 'unknown'],
    ['http://192.168.1.5/admin', 'unknown'],
    ['https://service.internal/status', 'unknown'],
    ['https://app.example.com/dashboard?secret=1', '/dashboard'],
    ['/reset-password/eyJhbGciOiJIUzI1NiJ9', 'unknown'],
    [{ route: '/x' }, 'unknown'],
    [['/x'], 'unknown'],
    [new Error('/private?token=abc'), 'unknown']
  ])('redacts %j to %j', (input, expected) => {
    expect(redactRoute(input)).toBe(expected);
  });
});

describe('redactCorrelationId', () => {
  it('keeps a bounded identifier and generates a safe one for hostile/missing input', () => {
    expect(redactCorrelationId('abc-123-def')).toBe('abc-123-def');
    expect(redactCorrelationId({ nested: true })).toMatch(/^[a-zA-Z0-9-]+$/);
    expect(redactCorrelationId(['x'])).toMatch(/^[a-zA-Z0-9-]+$/);
    expect(redactCorrelationId('id with spaces?token=1')).toMatch(
      /^[a-zA-Z0-9-]+$/
    );
    expect(redactCorrelationId(undefined)).toMatch(/^[a-zA-Z0-9-]+$/);
  });
});
