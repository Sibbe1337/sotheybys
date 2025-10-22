import { NextResponse } from 'next/server';
import { fetchLinearListings } from '@/lib/linear-api-adapter';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const listings = await fetchLinearListings('fi');
    
    // Find Korkeavuorenkatu 41
    const korkeavuorenkatu = listings.find(l => 
      l.title?.includes('Korkeavuorenkatu 41') || 
      l.acfRealEstate?.property?.address?.includes('Korkeavuorenkatu 41')
    );
    
    if (!korkeavuorenkatu) {
      return NextResponse.json({
        error: 'Korkeavuorenkatu 41 not found',
        totalListings: listings.length
      });
    }
    
    return NextResponse.json({
      title: korkeavuorenkatu.title,
      address: korkeavuorenkatu.acfRealEstate?.property?.address,
      rent: korkeavuorenkatu.acfRealEstate?.property?.rent,
      rentType: typeof korkeavuorenkatu.acfRealEstate?.property?.rent,
      rentLength: korkeavuorenkatu.acfRealEstate?.property?.rent?.length,
      price: korkeavuorenkatu.acfRealEstate?.property?.price,
      hasRentCheck: {
        exists: !!korkeavuorenkatu.acfRealEstate?.property?.rent,
        notNull: korkeavuorenkatu.acfRealEstate?.property?.rent !== null,
        notEmpty: korkeavuorenkatu.acfRealEstate?.property?.rent?.trim() !== '',
        notZero: korkeavuorenkatu.acfRealEstate?.property?.rent !== '0',
        notNullString: korkeavuorenkatu.acfRealEstate?.property?.rent !== 'null',
        notIncludesNull: !korkeavuorenkatu.acfRealEstate?.property?.rent?.toLowerCase().includes('null')
      },
      fullProperty: korkeavuorenkatu.acfRealEstate?.property
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

