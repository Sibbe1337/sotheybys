export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold mb-4">
          next-intl Setup Complete - Test Page
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Current locale: <strong>{locale}</strong>
        </p>
        <p className="text-gray-600">
          This is a test page to verify next-intl is working correctly.
        </p>
        <div className="mt-8 space-x-4">
          <a href="/fi" className="text-blue-600 underline">Finnish (fi)</a>
          <a href="/sv" className="text-blue-600 underline">Swedish (sv)</a>
          <a href="/en" className="text-blue-600 underline">English (en)</a>
        </div>
      </div>
    </main>
  );
}
