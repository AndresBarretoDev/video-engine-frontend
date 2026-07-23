'use client';

/**
 * BrandSelector — pick a brand to apply to the live video preview.
 *
 * Lists brands via useBrands(). Emits the selected brand id, or null for the
 * "Template default" option (caller then uses the template's fallback preset).
 *
 * Used by the authoring view. The selected brand's design tokens are mapped to a
 * RemotionBrandConfig (resolveRemotionBrand) and fed into the composition props.
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useBrands } from '../hooks/use-brands';
import { brandsTextMaps as t } from '../text-maps';

// Radix Select reserves the empty string — use a sentinel for the default option.
const DEFAULT_VALUE = '__template_default__';

interface BrandSelectorProps {
  /** Selected brand id, or null for the template default. */
  value: string | null;
  /** Emits the chosen brand id, or null for the template default. */
  onChange: (brandId: string | null) => void;
  id?: string;
  className?: string;
}

export function BrandSelector({
  value,
  onChange,
  id = 'brand-selector',
  className
}: BrandSelectorProps) {
  const { data: brands, isLoading } = useBrands();

  return (
    <div className={className}>
      <Label
        htmlFor={id}
        className="text-foreground mb-1.5 block text-sm font-medium"
      >
        {t.selectorLabel}
      </Label>
      <Select
        value={value ?? DEFAULT_VALUE}
        onValueChange={v => onChange(v === DEFAULT_VALUE ? null : v)}
        disabled={isLoading}
      >
        <SelectTrigger id={id} className="w-full" aria-label={t.selectorLabel}>
          <SelectValue
            placeholder={isLoading ? t.selectorLoading : t.selectorPlaceholder}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={DEFAULT_VALUE}>
            {t.selectorDefaultOption}
          </SelectItem>
          {(brands ?? [])
            .filter(b => b.isActive)
            .map(brand => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}
