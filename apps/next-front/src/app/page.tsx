import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';

/**
 * Root page - redirects to default locale
 *
 * With next-intl's localePrefix: 'as-needed', the root path needs to explicitly
 * redirect to the default locale path for proper routing.
 */
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
