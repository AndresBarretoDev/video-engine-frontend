'use client';

/**
 * OP Video Engine — Application Breadcrumbs
 *
 * Auto-generates breadcrumbs from the current route path.
 * Maps URL segments to labels via breadcrumb-config.ts.
 *
 * Spec: SPEC-LAYOUT-007
 */

import { Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { getBreadcrumbLabel } from './breadcrumb-config';

export function AppBreadcrumbs() {
  const pathname = usePathname();

  /* Split path into segments, strip empty strings */
  const segments = pathname.split('/').filter(Boolean);

  /* Build cumulative hrefs for each segment */
  const crumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = getBreadcrumbLabel(segment);
    const isLast = index === segments.length - 1;

    return { segment, href, label, isLast };
  });

  if (crumbs.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => (
          <Fragment key={crumb.href}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
