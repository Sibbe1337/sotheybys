import { notFound } from 'next/navigation';
import { getPageBySlug, getPostBySlug } from '@/lib/wordpress';
import Image from 'next/image';
import Link from 'next/link';

interface PageProps {
  params: {
    slug: string[];
  };
}

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = params;
  const fullSlug = slug.join('/');
  
  // Try to fetch as page first, then as post
  let page = await getPageBySlug(fullSlug);
  let post = null;
  let isPost = false;
  
  if (!page) {
    post = await getPostBySlug(fullSlug);
    isPost = true;
  }
  
  const content = page || post;
  
  if (!content) {
    notFound();
  }

  let publishedDate = '';
  if (content.date) {
    publishedDate = new Date(content.date).toLocaleDateString('fi-FI', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  return (
    <main className="flex-1">
      {/* Hero Section with Featured Image or Gradient */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white">
        {content.featuredImage ? (
          <div className="relative h-[400px] lg:h-[500px]">
            <Image
              src={content.featuredImage.node.sourceUrl}
              alt={content.featuredImage.node.altText || content.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            
            {/* Title Overlay */}
            <div className="absolute inset-0 flex items-end">
              <div className="container mx-auto px-4 pb-12">
                <div className="max-w-4xl">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-thin text-white mb-4">
                    {content.title}
                  </h1>
                  {publishedDate && (
                    <p className="text-white/80 text-lg font-light">
                      {publishedDate}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 lg:py-28">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-thin text-gray-900 mb-4">
                  {content.title}
                </h1>
                {publishedDate && (
                  <p className="text-gray-600 text-lg font-light">
                    {publishedDate}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Content Section */}
      <article className="py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Excerpt */}
            {content.excerpt && (
              <div className="mb-12">
                <div 
                  className="text-xl lg:text-2xl font-light text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: content.excerpt }} 
                />
              </div>
            )}
            
            {/* Main Content */}
            <div 
              dangerouslySetInnerHTML={{ __html: content.content || '' }}
              className="prose prose-lg lg:prose-xl max-w-none
                       prose-headings:font-light prose-headings:text-gray-900
                       prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                       prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                       prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                       prose-a:text-[#1a3a4a] prose-a:no-underline hover:prose-a:underline
                       prose-strong:font-medium prose-strong:text-gray-900
                       prose-ul:my-6 prose-li:my-2
                       prose-img:rounded-lg prose-img:shadow-lg"
            />

            {/* ACF Real Estate Fields if available */}
            {content.acfRealEstate && (
              <div className="mt-12 p-8 bg-gray-50 rounded-lg">
                <h3 className="text-2xl font-light text-gray-900 mb-6">Kiinteistön tiedot</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {content.acfRealEstate.property && (
                    <>
                      {content.acfRealEstate.property.address && (
                        <div>
                          <span className="text-sm text-gray-600 uppercase tracking-wider">Osoite</span>
                          <p className="text-lg font-light text-gray-900">{content.acfRealEstate.property.address}</p>
                        </div>
                      )}
                      {content.acfRealEstate.property.price && (
                        <div>
                          <span className="text-sm text-gray-600 uppercase tracking-wider">Hinta</span>
                          <p className="text-lg font-light text-gray-900">{content.acfRealEstate.property.price} €</p>
                        </div>
                      )}
                      {content.acfRealEstate.property.area && (
                        <div>
                          <span className="text-sm text-gray-600 uppercase tracking-wider">Pinta-ala</span>
                          <p className="text-lg font-light text-gray-900">{content.acfRealEstate.property.area} m²</p>
                        </div>
                      )}
                      {content.acfRealEstate.property.bedrooms && (
                        <div>
                          <span className="text-sm text-gray-600 uppercase tracking-wider">Makuuhuoneet</span>
                          <p className="text-lg font-light text-gray-900">{content.acfRealEstate.property.bedrooms}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <Link 
                  href="/"
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 
                           font-light transition-colors duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                          d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Takaisin etusivulle
                </Link>
                
                {isPost && (
                  <Link 
                    href="/blog"
                    className="inline-flex items-center gap-2 text-[#1a3a4a] hover:text-[#0f2633] 
                             font-light transition-colors duration-300"
                  >
                    Kaikki artikkelit
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                            d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}