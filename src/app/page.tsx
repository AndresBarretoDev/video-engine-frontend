/**
 * OP Video Engine — Root Page
 *
 * Redirects authenticated users to /dashboard.
 * Middleware handles redirect to /login if unauthenticated.
 * This page serves as the fallback landing route.
 */

import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/dashboard');
}
