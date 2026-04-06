/**
 * OP Video Engine — Settings Page
 *
 * Server Component. Placeholder for user profile and preferences management.
 * Will be expanded with profile editing, theme preferences, and notifications.
 */

import { Construction } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Construction className="text-muted-foreground/40 mb-4 size-12" />
      <h1 className="text-foreground text-2xl font-bold tracking-tight">
        Settings
      </h1>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm">
        Profile editing, theme preferences, and notification settings are coming
        soon.
      </p>
    </div>
  );
}
