/**
 * Root Layout - Minimal Passthrough
 *
 * This layout simply passes through to child layouts.
 * All actual rendering happens in [locale]/layout.tsx which handles:
 * - Locale context (NextIntlClientProvider)
 * - Fonts (Inter, Playfair Display)
 * - Global styles
 * - Header & Footer components
 * - Metadata generation
 */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}