import { NextRequest, NextResponse } from 'next/server';

/**
 * Image Proxy API Route
 * 
 * PROBLEM: images.linear.fi blocks direct browser requests from Vercel domain
 * SOLUTION: Proxy images through our server-side API
 * 
 * Usage: /api/image-proxy?url=https://images.linear.fi/abc123.jpg
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return new NextResponse('Missing url parameter', { status: 400 });
    }

    // Only allow Linear.fi images for security
    if (!imageUrl.startsWith('https://images.linear.fi/')) {
      return new NextResponse('Only Linear.fi images allowed', { status: 403 });
    }

    console.log('[Image Proxy] Fetching:', imageUrl);

    // Fetch image from server-side (bypasses CORS)
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Snellman-Sothebys-Website/1.0',
      },
    });

    if (!response.ok) {
      console.error('[Image Proxy] Failed to fetch:', response.status, response.statusText);
      return new NextResponse(`Failed to fetch image: ${response.statusText}`, { 
        status: response.status 
      });
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    console.log('[Image Proxy] Success:', imageUrl, `(${imageBuffer.byteLength} bytes)`);

    // Return image with proper headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('[Image Proxy] Error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
