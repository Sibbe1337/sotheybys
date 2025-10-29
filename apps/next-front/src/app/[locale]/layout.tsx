import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { locales } from '@/i18n/config';
import type { Locale } from '@/i18n/config';
import Header from '@/components/Header/Header';
import FooterWithTeam from '@/components/Footer/FooterWithTeam';
import '../globals.css';

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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const localeMap: Record<string, string> = {
    fi: 'fi_FI',
    sv: 'sv_SE',
    en: 'en_US'
  };

  return {
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
      locale: localeMap[locale] || 'fi_FI',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Snellman Sotheby\'s International Realty',
      description: 'Kansainvälinen kiinteistönvälitys paikallisesti',
      images: ['/og-image.jpg'],
    },
    alternates: {
      canonical: locale === 'fi' ? 'https://sothebysrealty.fi' : `https://sothebysrealty.fi/${locale}`,
      languages: {
        'fi': 'https://sothebysrealty.fi',
        'sv': 'https://sothebysrealty.fi/sv',
        'en': 'https://sothebysrealty.fi/en',
        'x-default': 'https://sothebysrealty.fi',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Fetch messages for the locale
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
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
      <body className="antialiased bg-white text-gray-900">
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-screen flex flex-col">
            <Header />
            {children}
            <FooterWithTeam />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
