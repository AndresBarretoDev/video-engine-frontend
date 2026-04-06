/**
 * OP Video Engine — Summary Card
 *
 * Clickable metric card: icon + label + value + link.
 * Used on the dashboard to show key metrics per role.
 *
 * Spec: SPEC-DASH-002, SPEC-DASH-003
 */

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { dashboardTextMap } from '@/domains/dashboard/text-maps';

interface SummaryCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  href: string;
}

export function SummaryCard({
  label,
  value,
  icon: Icon,
  href
}: SummaryCardProps) {
  return (
    <Link href={href} className="group block">
      <Card className="hover:bg-accent hover:border-primary/30 cursor-pointer py-0 transition-colors duration-[var(--duration-fast,150ms)]">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <p className="text-muted-foreground text-sm font-medium">
                {label}
              </p>
              <p className="text-3xl font-bold tabular-nums">
                {value.toLocaleString()}
              </p>
            </div>
            <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-8)]">
              <Icon className="size-5" />
            </div>
          </div>
          <div className="text-muted-foreground group-hover:text-primary mt-4 flex items-center gap-1 text-xs transition-colors">
            <ArrowRight className="size-3" />
            <span>{dashboardTextMap.viewLink}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
