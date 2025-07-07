import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'SothebysRealty.fi',
    template: '%s | SothebysRealty.fi',
  },
  description: 'Premium real estate properties in Finland',
  keywords: ['real estate', 'property', 'Finland', 'Sothebys'],
  authors: [{ name: 'SothebysRealty.fi' }],
  creator: 'SothebysRealty.fi',
  publisher: 'SothebysRealty.fi',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://sothebysrealty.fi',
  ),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    type: 'website',
    locale: 'fi_FI',
    url: '/',
    title: 'SothebysRealty.fi',
    description: 'Premium real estate properties in Finland',
    siteName: 'SothebysRealty.fi',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SothebysRealty.fi',
    description: 'Premium real estate properties in Finland',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fi" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
} 