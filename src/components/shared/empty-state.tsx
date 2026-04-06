/**
 * OP Video Engine — Empty State
 *
 * Displayed when a list or section has no items.
 * Icon + title + description + optional CTA button.
 *
 * Spec: SPEC-CROSS-003
 */

import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      {Icon && (
        <div className="bg-muted flex size-14 items-center justify-center rounded-[var(--radius-12)]">
          <Icon className="text-muted-foreground size-7" />
        </div>
      )}
      <div className="max-w-sm space-y-1.5">
        <p className="text-foreground font-semibold">{title}</p>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
      {action && (
        <>
          {action.href ? (
            <Button asChild size="sm">
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : (
            <Button size="sm" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
