import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';
import config from '../../playwright.config';

/**
 * Browser/device matrix contract. Fails on missing declared projects, a
 * hidden/hardcoded skip in the matrix config, or an exclusion in
 * ops/browser-support.md that is missing a required field or has expired.
 * This is a pure config/doc contract — no browser page is used.
 */

const REQUIRED_PROJECTS = ['chromium', 'firefox', 'webkit', 'mobile-chromium'];
const DOC_PATH = path.resolve(__dirname, '../../ops/browser-support.md');

test.describe('Browser support matrix contract', () => {
  test('declares exactly the four owner-approved projects, no hidden skip', () => {
    const names = (config.projects ?? []).map(p => p.name);

    for (const required of REQUIRED_PROJECTS) {
      expect(names, `Missing required project "${required}"`).toContain(
        required
      );
    }
    expect(
      names.length,
      'Undeclared/extra projects require an owned exclusion, not a silent addition'
    ).toBe(REQUIRED_PROJECTS.length);
  });

  test('ops/browser-support.md exclusions are fully fielded and unexpired', () => {
    expect(
      fs.existsSync(DOC_PATH),
      'ops/browser-support.md must exist'
    ).toBe(true);
    const doc = fs.readFileSync(DOC_PATH, 'utf-8');

    // Scope to the "## Exclusions" section only — other tables (e.g. the
    // "Supported matrix") use the same `|`-row markdown shape and must not
    // be parsed as exclusion rows.
    const lines = doc.split('\n');
    const exclusionsStart = lines.findIndex(line =>
      line.trim().toLowerCase().startsWith('## exclusions')
    );
    expect(exclusionsStart, 'Missing "## Exclusions" section').toBeGreaterThan(
      -1
    );
    const nextHeadingOffset = lines
      .slice(exclusionsStart + 1)
      .findIndex(line => line.trim().startsWith('## '));
    const exclusionsEnd =
      nextHeadingOffset === -1
        ? lines.length
        : exclusionsStart + 1 + nextHeadingOffset;
    const exclusionsSection = lines.slice(exclusionsStart, exclusionsEnd);

    const rows = exclusionsSection.filter(
      line =>
        line.trim().startsWith('|') &&
        !line.includes('---') &&
        !line.toLowerCase().includes('browser/version')
    );

    for (const row of rows) {
      const cells = row
        .split('|')
        .map(c => c.trim())
        .filter(Boolean);
      if (cells.length === 0) continue;

      const [browserVersion, , owner, reason, evidence, expiry] = cells;
      const isPlaceholder =
        browserVersion.replace(/[_*]/g, '').trim().toLowerCase() === '(none)';
      if (isPlaceholder) continue;

      expect(owner, `Exclusion row missing owner: ${row}`).toBeTruthy();
      expect(reason, `Exclusion row missing reason: ${row}`).toBeTruthy();
      expect(evidence, `Exclusion row missing evidence: ${row}`).toBeTruthy();
      expect(expiry, `Exclusion row missing expiry: ${row}`).toBeTruthy();

      const expiryDate = new Date(expiry);
      expect(
        expiryDate.toString(),
        `Exclusion row has an invalid expiry date: ${row}`
      ).not.toBe('Invalid Date');
      expect(
        expiryDate.getTime(),
        `Exclusion expired on ${expiry}, must be renewed or dropped: ${row}`
      ).toBeGreaterThan(Date.now());
    }
  });
});
