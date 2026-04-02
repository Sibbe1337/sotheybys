'use client';

import FeaturedPropertyCard from '@/components/Property/FeaturedPropertyCard';
import { Link } from '@/lib/navigation';
import { isCommercial } from '@/lib/domain/property-type-helpers';
import type { Property } from '@/lib/domain/property.types';
import type { SupportedLanguage } from '@/lib/homepage-translations';

interface Props {
  properties: Property[];
  language: SupportedLanguage;
}

function mapProperty(property: Property, language: SupportedLanguage) {
  const rent = property.meta.rent || property.rental?.monthlyRent || 0;
  const isRental = rent > 0;
  const isCommercialProperty = isCommercial(property);
  const typeCode = (property.meta.typeCode || '').toLowerCase();
  const isApartmentType = typeCode.includes('kerrostalo') || typeCode.includes('flat') || typeCode.includes('apartment');

  let variant: 'apartment' | 'property' | 'rental' | 'commercial' = 'property';
  if (isRental) variant = 'rental';
  else if (isCommercialProperty) variant = 'commercial';
  else if (isApartmentType) variant = 'apartment';

  const addressParts = [
    property.address[language] || property.address.fi,
    property.gate || '',
  ].filter(Boolean);
  const title = addressParts.join(' ').trim();
  const postalCode = property.postalCode;
  const city = property.city[language] || property.city.fi;
  const fullAddress = postalCode
    ? `${title}, ${postalCode} ${city}`.trim()
    : `${title}, ${city}`.trim();

  const images = (property.media.images || [])
    .filter(img => !img.floorPlan)
    .slice(0, 3)
    .map(img => ({ url: img.url, alt: title }));

  const district = property.district?.[language] || property.district?.fi;
  const propertyType = property.meta.listingTypeLabel?.[language] || property.meta.listingTypeLabel?.fi || property.meta.typeCode;
  const apartmentType = property.meta.apartmentType?.[language] || property.meta.apartmentType?.fi;
  const marketingTitle = property.descriptionTitle?.[language] || property.descriptionTitle?.fi;

  const balconyArea = property.dimensions.balcony || 0;
  const terraceArea = property.dimensions.terrace || 0;
  const otherArea = balconyArea + terraceArea > 0 ? balconyArea + terraceArea : undefined;

  const agent = property.agent ? {
    name: property.agent.name || '',
    phone: property.agent.phone || '',
    email: property.agent.email || '',
    photoUrl: property.agent.photoUrl || undefined,
  } : undefined;

  return {
    title, fullAddress, propertyType, apartmentType, marketingTitle,
    district, images, variant, otherArea, agent, rent,
    livingArea: property.dimensions.living,
    totalArea: property.dimensions.total,
    businessArea: property.dimensions.business,
    plotArea: property.dimensions.plot,
    askPrice: property.pricing.sales,
    debtFreePrice: property.pricing.debtFree,
    biddingStartPrice: property.pricing.biddingStartPrice,
    biddingUrl: property.pricing.biddingUrl,
    href: `/${language}/kohde/${property.slug}`,
    id: property.id,
  };
}

export default function FeaturedPropertiesSection({ properties, language }: Props) {
  const featuredProperties = properties.filter(p =>
    !p.meta.status || p.meta.status === 'ACTIVE'
  ).slice(0, 6);

  const rentalProperties = properties.filter(p =>
    (p.meta.rent && p.meta.rent > 0) || (p.rental?.monthlyRent && p.rental.monthlyRent > 0)
  ).slice(0, 4);

  return (
    <>
      {/* Featured Properties Section */}
      {featuredProperties.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl lg:text-4xl font-light text-center mb-12">
              {language === 'fi'
                ? 'Valikoidut myynnissä olevat kohteet'
                : language === 'sv'
                  ? 'Utvalda objekt till salu'
                  : 'Selected properties for sale'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => {
                const m = mapProperty(property, language);
                return (
                  <FeaturedPropertyCard
                    key={m.id}
                    href={m.href}
                    locale={language}
                    title={m.title}
                    fullAddress={m.fullAddress}
                    propertyType={m.propertyType}
                    apartmentType={m.apartmentType}
                    marketingTitle={m.marketingTitle}
                    district={m.district}
                    images={m.images}
                    showCarousel={true}
                    variant={m.variant}
                    livingArea={m.livingArea}
                    otherArea={m.otherArea}
                    totalArea={m.totalArea}
                    businessArea={m.businessArea}
                    plotArea={m.plotArea}
                    askPrice={m.askPrice}
                    debtFreePrice={m.debtFreePrice}
                    monthlyRent={m.rent}
                    biddingStartPrice={m.biddingStartPrice}
                    biddingUrl={m.biddingUrl}
                    agent={m.agent}
                  />
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/kohteet"
                className="inline-block bg-[#002349] text-white px-8 py-3
                         hover:bg-[#001731] transition-colors duration-300
                         font-light uppercase tracking-wider text-sm"
              >
                {language === 'fi' ? 'Kaikki myynnissä olevat kohteemme' : language === 'sv' ? 'Alla våra objekt till salu' : 'All our properties for sale'}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Rental Properties Section */}
      {rentalProperties.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl lg:text-4xl font-light text-center mb-12">
              {language === 'fi'
                ? 'Uusimmat vuokrakohteet'
                : language === 'sv'
                  ? 'Senaste hyresobjekt'
                  : 'Latest rental properties'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rentalProperties.map((property) => {
                const m = mapProperty(property, language);
                return (
                  <FeaturedPropertyCard
                    key={m.id}
                    href={m.href}
                    locale={language}
                    title={m.title}
                    fullAddress={m.fullAddress}
                    propertyType={m.propertyType}
                    district={m.district}
                    images={m.images}
                    showCarousel={true}
                    variant="rental"
                    livingArea={m.livingArea}
                    totalArea={m.totalArea}
                    monthlyRent={m.rent}
                    agent={m.agent}
                  />
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/kohteet/vuokrakohteet"
                className="inline-block bg-[#002349] text-white px-8 py-3
                         hover:bg-[#001731] transition-colors duration-300
                         font-light uppercase tracking-wider text-sm"
                prefetch={true}
              >
                {language === 'fi' ? 'Kaikki vuokrakohteemme' : language === 'sv' ? 'Alla våra hyresobjekt' : 'All our rental properties'}
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
