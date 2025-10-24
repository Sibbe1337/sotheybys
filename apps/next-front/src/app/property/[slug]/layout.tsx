import { Metadata } from 'next';

interface PropertyLayoutProps {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}

/**
 * Server Component Layout for Property Pages
 * CRITICAL: Use static metadata to avoid server-side fetch errors
 * Client-side page component will handle dynamic content
 */
export const metadata: Metadata = {
  title: 'Snellman Sotheby\'s International Realty',
  description: 'Premium real estate in Finland',
};

export default function PropertyLayout({ children }: PropertyLayoutProps) {
  return <>{children}</>;
}

