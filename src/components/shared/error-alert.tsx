/**
 * OP Video Engine — Error Alert
 *
 * Displays an error message with an optional retry button.
 * Uses shadcn Alert component.
 *
 * Spec: SPEC-CROSS-002
 */

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { layoutTextMap } from '@/constants/layout-text-maps';

interface ErrorAlertProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorAlert({
  title = layoutTextMap.errors.generic,
  message = layoutTextMap.errors.retry,
  onRetry
}: ErrorAlertProps) {
  return (
    <div className="flex flex-col items-start gap-4">
      <Alert variant="destructive" className="max-w-lg">
        <AlertCircle className="size-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {layoutTextMap.actions.retry}
        </Button>
      )}
    </div>
  );
}
