import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { locales, defaultLocale } from '@/i18n/config';
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

  // Correct canonical URL (must match current page URL exactly)
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://sothebysrealty.fi';
  const canonical = locale === 'fi' ? base : `${base}/${locale}`;

  return {
    metadataBase: new URL(base),
    title: 'Snellman Sotheby\'s International Realty',
    description: 'Kansainvälinen kiinteistönvälitys paikallisesti - Premium real estate services in Finland',
    keywords: 'kiinteistönvälitys, luksusasunnot, Sotheby\'s, Finland, real estate',
    openGraph: {
      title: 'Snellman Sotheby\'s International Realty',
      description: 'Kansainvälinen kiinteistönvälitys paikallisesti',
      url: canonical,
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
      canonical,
      languages: {
        'fi-FI': `${base}/fi`,
        'sv-SE': `${base}/sv`,
        'en-GB': `${base}/en`,
        'x-default': base,
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
  // Never throw notFound() for unsupported locale - render with fallback instead
  let validLocale: Locale = locale as Locale;
  if (!locales.includes(locale as Locale)) {
    console.warn(`Unsupported locale requested: ${locale}, falling back to ${defaultLocale}`);
    validLocale = defaultLocale;
  }

  // Fetch messages for the locale
  const messages = await getMessages();

  return (
    <html lang={validLocale}>
      <body className={`${inter.variable} ${playfair.variable}`}>
    <NextIntlClientProvider locale={validLocale} messages={messages}>
      <div className="min-h-screen flex flex-col">
        <Header locale={locale as 'fi' | 'sv' | 'en'} />
        {children}
        <FooterWithTeam />
      </div>
    </NextIntlClientProvider>
      </body>
    </html>
  );
}
