'use client';

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useThemeStore } from '@/domains/layout/stores/theme-store';
import { navigationTextMap } from '@/domains/navigation/text-maps';

export function ThemeToggle() {
  const { theme, toggle } = useThemeStore();
  const isDark = theme === 'dark';
  const label = isDark
    ? navigationTextMap.themeToggle.switchToLight
    : navigationTextMap.themeToggle.switchToDark;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={toggle}
          aria-label={label}
        >
          {isDark ? (
            <Sun className="text-muted-foreground size-4" />
          ) : (
            <Moon className="text-muted-foreground size-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}
