import { NextResponse } from 'next/server';
import { getMenuItems } from '@/lib/wordpress';

export async function GET(
  request: Request,
  { params }: { params: { location: string } }
) {
  try {
    const menuItems = await getMenuItems(params.location);
    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json([], { status: 500 });
  }
}
