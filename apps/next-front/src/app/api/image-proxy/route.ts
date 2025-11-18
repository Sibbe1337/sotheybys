import { NextRequest, NextResponse } from 'next/server';

/**
 * Image proxy to bypass CORS restrictions from images.linear.fi
 * 
 * Usage: /api/image-proxy?url=https://images.linear.fi/...jpg
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  // Security: Only allow images.linear.fi
  if (!imageUrl.startsWith('https://images.linear.fi/')) {
    return NextResponse.json({ error: 'Invalid image URL' }, { status: 403 });
  }

  try {
    // Fetch image from Linear.fi
    const imageResponse = await fetch(imageUrl, {
      headers: {
        // Pretend to be a regular browser
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'fi-FI,fi;q=0.9,en-US;q=0.8,en;q=0.7,sv;q=0.6',
      },
      // @ts-ignore - next option exists in Node 18+
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!imageResponse.ok) {
      console.error('[Image Proxy] Failed to fetch:', imageUrl, imageResponse.status);
      return NextResponse.json(
        { error: `Failed to fetch image: ${imageResponse.status}` },
        { status: imageResponse.status }
      );
    }

    // Get image data
    const imageData = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

    // Return image with proper headers
    return new NextResponse(imageData, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache 1 year
        'Access-Control-Allow-Origin': '*', // Allow CORS
      },
    });
  } catch (error) {
    console.error('[Image Proxy] Error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy image' },
      { status: 500 }
    );
  }
}

// Enable CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

