import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { headers } from 'next/headers';
import './globals.css';
import Header from '@/components/Header/Header';
import FooterWithTeam from '@/components/Footer/FooterWithTeam';

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

export const metadata: Metadata = {
  metadataBase: new URL('https://sothebysrealty.fi'),
  title: 'Snellman Sotheby\'s International Realty',
  description: 'Kansainvälinen kiinteistönvälitys paikallisesti - Premium real estate services in Finland',
  keywords: 'kiinteistönvälitys, luksusasunnot, Sotheby\'s, Finland, real estate',
  openGraph: {
    title: 'Snellman Sotheby\'s International Realty',
    description: 'Kansainvälinen kiinteistönvälitys paikallisesti',
    url: 'https://sothebysrealty.fi',
    siteName: 'Snellman Sotheby\'s International Realty',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'fi_FI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Snellman Sotheby\'s International Realty',
    description: 'Kansainvälinen kiinteistönvälitys paikallisesti',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get locale from middleware header (defaults to 'fi')
  const headersList = headers();
  const locale = headersList.get('x-locale') || 'fi';
  
  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#002349" />
        {/* Preconnect to external resources for faster loading */}
        <link rel="preconnect" href="https://images.linear.fi" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.youtube.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://player.vimeo.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://use.typekit.net/uhz3avz.css" />
      </head>
      <body className="antialiased bg-white text-gray-900">
        <div className="min-h-screen flex flex-col">
          <Header />
          {children}
          <FooterWithTeam />
        </div>
      </body>
    </html>
  );
}