/**
 * Root Layout for next-intl
 *
 * This is the root layout that wraps all pages.
 * It includes <html> and <body> tags with global styles and fonts.
 *
 * The actual locale-specific content and NextIntlClientProvider is in [locale]/layout.tsx
 */

import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#002349" />

        {/* Hreflang tags for multilingual SEO */}
        <link rel="alternate" hrefLang="fi" href="https://sothebysrealty.fi" />
        <link rel="alternate" hrefLang="sv" href="https://sothebysrealty.fi/sv" />
        <link rel="alternate" hrefLang="en" href="https://sothebysrealty.fi/en" />
        <link rel="alternate" hrefLang="x-default" href="https://sothebysrealty.fi" />

        {/* Preconnect to external resources for faster loading */}
        <link rel="preconnect" href="https://images.linear.fi" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.youtube.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://player.vimeo.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://use.typekit.net/uhz3avz.css" />
      </head>
      <body suppressHydrationWarning className="antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
