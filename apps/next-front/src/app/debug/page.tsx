import { getPosts, getProperties, getSiteSettings } from '@/lib/wordpress';

export default async function DebugPage() {
  console.log('=== DEBUG PAGE STARTING ===');
  
  try {
    // Test basic posts
    console.log('Testing getPosts...');
    const posts = await getPosts(3);
    console.log('getPosts result:', { 
      count: posts?.length || 0, 
      first: posts?.[0]?.title || 'none',
      posts: posts?.map(p => ({ id: p.id, title: p.title, slug: p.slug }))
    });

    // Test properties 
    console.log('Testing getProperties...');
    const properties = await getProperties(3);
    console.log('getProperties result:', { 
      count: properties?.length || 0, 
      first: properties?.[0]?.title || 'none'
    });

    // Test site settings
    console.log('Testing getSiteSettings...');
    const siteSettings = await getSiteSettings();
    console.log('getSiteSettings result:', siteSettings);

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">WordPress GraphQL Debug</h1>
        
        <div className="grid gap-6">
          {/* Posts Debug */}
          <div className="bg-white p-4 rounded border">
            <h2 className="text-xl font-semibold mb-3">Posts ({posts?.length || 0})</h2>
            {posts && posts.length > 0 ? (
              <div className="space-y-2">
                {posts.map((post) => (
                  <div key={post.id} className="border-l-4 border-blue-500 pl-3">
                    <strong>{post.title}</strong>
                    <div className="text-sm text-gray-600">
                      ID: {post.id} | Slug: {post.slug} | Date: {post.date}
                    </div>
                    {post.featuredImage?.node && (
                      <div className="text-xs text-green-600">
                        ✅ Featured image: {post.featuredImage.node.sourceUrl}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-red-600">❌ No posts found</div>
            )}
          </div>

          {/* Properties Debug */}
          <div className="bg-white p-4 rounded border">
            <h2 className="text-xl font-semibold mb-3">Properties ({properties?.length || 0})</h2>
            {properties && properties.length > 0 ? (
              <div className="space-y-2">
                {properties.map((property) => (
                  <div key={property.id} className="border-l-4 border-green-500 pl-3">
                    <strong>{property.title}</strong>
                    <div className="text-sm text-gray-600">
                      ID: {property.id} | Slug: {property.slug}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-orange-600">⚠️ No properties found (expected - ACF not configured)</div>
            )}
          </div>

          {/* Site Settings Debug */}
          <div className="bg-white p-4 rounded border">
            <h2 className="text-xl font-semibold mb-3">Site Settings</h2>
            {siteSettings ? (
              <div className="space-y-1">
                <div><strong>Title:</strong> {siteSettings.title}</div>
                <div><strong>Description:</strong> {siteSettings.description}</div>
                <div><strong>URL:</strong> {siteSettings.url}</div>
              </div>
            ) : (
              <div className="text-red-600">❌ No site settings found</div>
            )}
          </div>

          {/* Environment Variables */}
          <div className="bg-gray-50 p-4 rounded border">
            <h2 className="text-xl font-semibold mb-3">Environment Variables</h2>
            <div className="space-y-1 text-sm">
              <div><strong>NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL:</strong> {process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || '❌ Not set'}</div>
              <div><strong>NEXT_PUBLIC_WORDPRESS_SITE_URL:</strong> {process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL || '❌ Not set'}</div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Debug page error:', error);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6 text-red-600">Debug Error</h1>
        <div className="bg-red-50 border border-red-200 p-4 rounded">
          <pre className="text-sm">{String(error)}</pre>
        </div>
      </div>
    );
  }
} 