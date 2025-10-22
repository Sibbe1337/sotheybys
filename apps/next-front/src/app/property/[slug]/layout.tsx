import { Metadata } from 'next';
import { generatePropertyMetadata } from './metadata';

interface PropertyLayoutProps {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}

/**
 * Server Component Layout for Property Pages
 * Generates dynamic metadata for SEO
 */
export async function generateMetadata({ params }: PropertyLayoutProps): Promise<Metadata> {
  return generatePropertyMetadata(params.slug);
}

export default function PropertyLayout({ children }: PropertyLayoutProps) {
  return <>{children}</>;
}

