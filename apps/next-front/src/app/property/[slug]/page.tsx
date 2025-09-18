import { notFound } from 'next/navigation';
import Image from 'next/image';
import HeaderBranding from '@/components/Header/HeaderBranding';
import MainMenu from '@/components/Header/MainMenu';
import AgentCard from '@/components/Agent/AgentCard';
import { getPropertyBySlug } from '@/lib/wordpress';
import { fetchLinearListings, fetchTestLinearListings } from '@/lib/linear-api-adapter';
import { listingsCache, ensureCacheInitialized } from '@/lib/listings-cache';

interface PropertyPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = params;
  
  // First try to get from Linear API cache
  await ensureCacheInitialized();
  let property: any = listingsCache.getConvertedListingBySlug(slug, 'en');
  
  // If not found in cache, try WordPress
  if (!property) {
    property = await getPropertyBySlug(slug);
  }

  if (!property) {
    notFound();
  }

  // Extract property data - handle both WordPress and Linear API formats
  const propertyData = property.acfRealEstate?.property || property.property || {};
  const agentData = property.acfRealEstate?.agent || property.agent || {};

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseInt(price.replace(/\D/g, '')) : price;
    return new Intl.NumberFormat('fi-FI', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

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
        {/* Property Hero */}
        {property.featuredImage && (
          <section className="relative h-96 lg:h-[500px]">
            <Image
              src={property.featuredImage.node.sourceUrl}
              alt={property.featuredImage.node.altText || property.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-30" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="container">
                <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                  {property.title}
                </h1>
                {propertyData?.price && (
                  <div className="text-2xl lg:text-3xl font-semibold">
                    {formatPrice(propertyData.price)}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Property Details */}
        <section className="py-12">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Property Info */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  {propertyData?.address && (
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <span>📍</span>
                      <span>
                        {propertyData.address}
                        {propertyData.city && `, ${propertyData.city}`}
                      </span>
                    </div>
                  )}

                  {/* Property Stats */}
                  {(propertyData?.bedrooms || propertyData?.bathrooms || propertyData?.area) && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      {propertyData.bedrooms && (
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-lg font-semibold">{propertyData.bedrooms}</div>
                          <div className="text-sm text-gray-600">Bedrooms</div>
                        </div>
                      )}
                      {propertyData.bathrooms && (
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-lg font-semibold">{propertyData.bathrooms}</div>
                          <div className="text-sm text-gray-600">Bathrooms</div>
                        </div>
                      )}
                      {propertyData.area && (
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-lg font-semibold">{propertyData.area}</div>
                          <div className="text-sm text-gray-600">Square Meters</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  {(propertyData.description || property.content) && (
                    <div className="prose max-w-none">
                      <h2 className="text-2xl font-semibold mb-4">Description</h2>
                      <div 
                        dangerouslySetInnerHTML={{ __html: propertyData.description || property.content }}
                        className="text-gray-700 leading-relaxed"
                      />
                    </div>
                  )}
                </div>

                {/* Property Gallery */}
                {((propertyData?.gallery && propertyData.gallery.length > 0) || 
                  (property.images && property.images.length > 0)) && (
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {(propertyData?.gallery || property.images || []).map((image, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                          <Image
                            src={image.url || image.sourceUrl}
                            alt={image.title || image.altText || `Property image ${index + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location Map */}
                {propertyData?.location && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4">Location</h2>
                    <div className="text-gray-600 mb-4">
                      <p>Coordinates: {propertyData.location.latitude}, {propertyData.location.longitude}</p>
                      {propertyData.location.streetAddress && (
                        <p>Address: {propertyData.location.streetAddress}</p>
                      )}
                    </div>
                    {/* TODO: Add interactive map component */}
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Interactive map will be displayed here</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Contact Agent */}
                {agentData && agentData.name && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Contact Agent</h2>
                    <AgentCard agent={agentData} />
                  </div>
                )}

                {/* Quick Contact Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Request Information</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="+358 XX XXX XXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="I'm interested in this property..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
                    >
                      Send Message
                    </button>
                  </form>
                </div>

                {/* Property Features */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Property Features</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Premium location</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Modern design</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>High-end finishes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Energy efficient</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
    </div>
  );
}