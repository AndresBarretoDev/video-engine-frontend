/**
 * OP Video Engine — Public Build Identity (F4, PR-F03/PR-F04)
 *
 * Exposes ONLY the approved candidate SHA and package version. Grants no
 * authorization and MUST NOT leak secrets or environment beyond these two
 * fields (see src/lib/validation/image-contract.ts#validateBuildInfoResponse).
 * Public by design (see src/middleware.ts — `/api` bypasses the auth guard);
 * product routes remain protected independently of this route.
 */

import { NextResponse } from 'next/server';
import { version } from '../../../../package.json';

export function GET() {
  return NextResponse.json({
    sha: process.env.NEXT_PUBLIC_BUILD_SHA ?? 'unknown',
    version
  });
}
