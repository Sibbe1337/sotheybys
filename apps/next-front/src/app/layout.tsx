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
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="128x128" href="/favicon-128.png" />
        <link rel="icon" type="image/png" sizes="196x196" href="/favicon-196x196.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png" />
        <meta name="msapplication-TileColor" content="#002349" />
        <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
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
