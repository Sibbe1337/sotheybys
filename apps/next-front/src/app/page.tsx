import { redirect } from 'next/navigation';

/**
 * Root page - Redirects to Finnish homepage
 *
 * Visitors landing on / are redirected to /fi (default locale)
 */
export default function RootPage() {
  redirect('/fi');
}
