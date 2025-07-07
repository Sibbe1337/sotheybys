export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          SothebysRealty.fi
        </h1>
        <p className="mx-auto max-w-2xl text-lg leading-8 text-gray-600">
          Premium real estate properties in Finland. Coming soon with Linear
          integration and Sanity CMS.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <div className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            🚧 Under Construction
          </div>
        </div>
      </div>
    </div>
  );
} 