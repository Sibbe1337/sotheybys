import HeaderBranding from '@/components/Header/HeaderBranding';
import MainMenu from '@/components/Header/MainMenu';
import PropertyCard from '@/components/Property/PropertyCard';
import { getProperties } from '@/lib/wordpress';

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function PropertiesPage() {
  const properties = await getProperties(24) || [];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <HeaderBranding />
            <MainMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gray-50 py-12">
          <div className="container">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Premium Properties
              </h1>
              <p className="text-lg text-gray-600">
                Discover exceptional real estate opportunities in Finland's most desirable locations.
                Our curated selection of premium properties offers the finest in luxury living.
              </p>
            </div>
          </div>
        </section>

        {/* Properties Grid */}
        <section className="py-12">
          <div className="container">
            {properties.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {properties.length} Properties Available
                  </h2>
                  
                  {/* TODO: Add filters/sorting */}
                  <div className="text-sm text-gray-600">
                    Showing all properties
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      id={property.id}
                      title={property.title}
                      slug={property.slug}
                      excerpt={property.excerpt}
                      featuredImage={property.featuredImage}
                      property={property.property}
                      agent={property.agent}
                    />
                  ))}
                </div>

                {/* TODO: Add pagination */}
                <div className="mt-12 flex justify-center">
                  <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md transition-colors">
                    Load More Properties
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Properties Available
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  We're currently updating our property listings. Please check back soon for new opportunities.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
    </div>
  );
}