/**
 * Next.js loading.tsx — shows while author page suspends.
 * Matches the split-layout skeleton so there is no layout shift.
 */
import { AuthoringSkeleton } from './_components/authoring-skeleton';

export default function AuthorLoading() {
  return <AuthoringSkeleton />;
}
