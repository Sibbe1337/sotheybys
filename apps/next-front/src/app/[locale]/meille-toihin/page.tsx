import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/lib/domain/property.types';

const translations = {
  fi: {
    title: 'Meille töihin',
    heroTitle: 'Welcome to Snellman Sotheby\'s International Realty',
    heroIntro: 'We represent and sell extraordinary homes in a variety of categories and price points. The mission in our daily work as real estate professionals is to Artfully Unite Extraordinary Homes with Extraordinary Lives',
    heroText1: 'Sotheby\'s International Realty® is recognized as an aspirational brand serving the luxury market. Regardless of what lifestyle desires you the most, we are here to serve you.',
    heroText2: 'Luxury is not a price point, it is a lifestyle',
    heroText3: 'As a broker in our sales team you have a great opportunity to build your own career on properties that suits your profile best.',
    wishTitle: 'Wish to join us?',
    wishSubtitle: 'Our Career opportunities.',
    
    // Position 1
    pos1Category: 'Real Estate & Sales',
    pos1Title: 'Local Real Estate & Sales Professional',
    pos1Intro: 'Our network of luxury real estate agents provides unrivaled access to distinctive properties around the world. To represent a home of distinction requires highly-qualified real estate professionals with global reach and local expertise.',
    pos1Description: 'Snellman Sotheby\'s International Realty is growing and we are constantly looking for professionals to join our sales team. We are now welcoming 2-3 new real estate agents to join our company.\n\nThis is an opportunity to work for a successful, growing company with a strong global presence and a powerful brand. We highly value motivation and a positive team spirit as well as enthusiasm to help our company grow. You will work independently while still be part of a great team.',
    pos1ReqTitle: 'We Require:',
    pos1Req1: 'Licensed real estate brokers LKV with proven sales record',
    pos1Req2: 'Minimum 2+ years of experience as a real estate broker on the Finnish market, preferably in the Greater Helsinki area',
    pos1Req3: 'A special touch for luxury and premium customer focus',
    pos1Req4: 'Strong people and social skills with the motivation to develop and expand the client base',
    pos1Req5: 'Fluency in Finnish and English required. Other language skills are beneficial.',
    pos1Req6: 'In-depth knowledge of the current market situation and skills to aid clients throughout the whole buying / selling process',
    pos1Req7: 'Working knowledge of Microsoft Office Suite as well as local listing programs and general computer usage. Note! We work in an Apple environment',
    pos1OfferTitle: 'We offer:',
    pos1Offer1: 'Competitive performance based commission',
    pos1Offer2: 'Powerful marketing tools on a local and global basis',
    pos1Offer3: 'The finest looking office in town (in a very central location)',
    pos1Offer4: 'An inspiring work environment with the most powerful brand in the world',
    pos1Offer5: 'To work with international clients',
    pos1Offer6: 'A great experience and opportunity to grow with an international company',
    pos1Offer7: 'Possibility to specialize within different segments / property types',
    pos1Offer8: 'Fun co-workers 🙂',
    pos1Location: 'Location: Helsinki, Finland',
    
    // Position 2
    pos2Category: 'Area Representation',
    pos2Title: 'Real Estate Area Representative',
    pos2Intro: 'Our office may be located physically in Helsinki but our commitment covers the entire country. Our listings are situated all over Finland and require experienced area representatives. We are partnering with local brokers to support us with the sales process.',
    pos2Description: 'Snellman Sotheby\'s International Realty is growing and we are constantly looking for professionals to join our sales team. Our office is located in central Helsinki, but our operations reach the whole country. We have incredible homes for sale all over Finland, and we need local / seasonal professionals to serve and represent us on specific markets.',
    pos2ReqTitle: 'We Require:',
    pos2Req1: 'Licensed real estate broker LKV',
    pos2Req2: 'Minimum 2+ years of experience as a real estate broker on the Finnish market',
    pos2Req3: 'A special touch for luxury and premium customer focus',
    pos2Req4: 'Strong people and social skills and motivation to develop and expand the client base',
    pos2Req5: 'Fluency in Finnish and English required. Other language skills are beneficial',
    pos2Req6: 'In-depth knowledge of the local market situation and skills to aid clients throughout the whole buying / selling process',
    pos2Req7: 'Established territory in some of following areas: Lapland/ Turku / Tampere / Southern Archipelago / Lake District',
    pos2OfferTitle: 'We Offer:',
    pos2Offer1: 'Competitive performance based commission',
    pos2Offer2: 'Powerful marketing tools on a local and global basis',
    pos2Offer3: 'International sales channels',
    pos2Offer4: 'A great experience and opportunity to grow with a global company',
    pos2Offer5: 'Possibility to work with international clients',
    pos2Offer6: 'Support your career as a real estate professional',
    pos2Offer7: 'Possibility to work within different segments / property types',
    pos2Offer8: 'A network of regional sales representatives',
    pos2Location: 'Location: Helsinki, Finland',
    
    contactName: 'Robert Charpentier',
    contactTitle: 'Chairman, M.Sc., LKV',
    contactPhone: '+358 (0)400 243 011',
    contactEmail: 'robert@sothebysrealty.fi',
    contactCta: 'Are you the one we are looking for? Connect with us and send us your application as soon as possible.',
    applyBtn: 'Apply for this job',
    readMore: 'Read more »',
    forMoreInfo: 'For more information:',
  },
  sv: {
    title: 'Jobba hos oss',
    heroTitle: 'Welcome to Snellman Sotheby\'s International Realty',
    heroIntro: 'We represent and sell extraordinary homes in a variety of categories and price points. The mission in our daily work as real estate professionals is to Artfully Unite Extraordinary Homes with Extraordinary Lives',
    heroText1: 'Sotheby\'s International Realty® is recognized as an aspirational brand serving the luxury market. Regardless of what lifestyle desires you the most, we are here to serve you.',
    heroText2: 'Luxury is not a price point, it is a lifestyle',
    heroText3: 'As a broker in our sales team you have a great opportunity to build your own career on properties that suits your profile best.',
    wishTitle: 'Wish to join us?',
    wishSubtitle: 'Our Career opportunities.',
    pos1Category: 'Real Estate & Sales',
    pos1Title: 'Local Real Estate & Sales Professional',
    pos1Intro: 'Our network of luxury real estate agents provides unrivaled access to distinctive properties around the world. To represent a home of distinction requires highly-qualified real estate professionals with global reach and local expertise.',
    pos1Description: 'Snellman Sotheby\'s International Realty is growing and we are constantly looking for professionals to join our sales team. We are now welcoming 2-3 new real estate agents to join our company.\n\nThis is an opportunity to work for a successful, growing company with a strong global presence and a powerful brand. We highly value motivation and a positive team spirit as well as enthusiasm to help our company grow. You will work independently while still be part of a great team.',
    pos1ReqTitle: 'We Require:',
    pos1Req1: 'Licensed real estate brokers LKV with proven sales record',
    pos1Req2: 'Minimum 2+ years of experience as a real estate broker on the Finnish market, preferably in the Greater Helsinki area',
    pos1Req3: 'A special touch for luxury and premium customer focus',
    pos1Req4: 'Strong people and social skills with the motivation to develop and expand the client base',
    pos1Req5: 'Fluency in Finnish and English required. Other language skills are beneficial.',
    pos1Req6: 'In-depth knowledge of the current market situation and skills to aid clients throughout the whole buying / selling process',
    pos1Req7: 'Working knowledge of Microsoft Office Suite as well as local listing programs and general computer usage. Note! We work in an Apple environment',
    pos1OfferTitle: 'We offer:',
    pos1Offer1: 'Competitive performance based commission',
    pos1Offer2: 'Powerful marketing tools on a local and global basis',
    pos1Offer3: 'The finest looking office in town (in a very central location)',
    pos1Offer4: 'An inspiring work environment with the most powerful brand in the world',
    pos1Offer5: 'To work with international clients',
    pos1Offer6: 'A great experience and opportunity to grow with an international company',
    pos1Offer7: 'Possibility to specialize within different segments / property types',
    pos1Offer8: 'Fun co-workers 🙂',
    pos1Location: 'Location: Helsinki, Finland',
    pos2Category: 'Area Representation',
    pos2Title: 'Real Estate Area Representative',
    pos2Intro: 'Our office may be located physically in Helsinki but our commitment covers the entire country. Our listings are situated all over Finland and require experienced area representatives. We are partnering with local brokers to support us with the sales process.',
    pos2Description: 'Snellman Sotheby\'s International Realty is growing and we are constantly looking for professionals to join our sales team. Our office is located in central Helsinki, but our operations reach the whole country. We have incredible homes for sale all over Finland, and we need local / seasonal professionals to serve and represent us on specific markets.',
    pos2ReqTitle: 'We Require:',
    pos2Req1: 'Licensed real estate broker LKV',
    pos2Req2: 'Minimum 2+ years of experience as a real estate broker on the Finnish market',
    pos2Req3: 'A special touch for luxury and premium customer focus',
    pos2Req4: 'Strong people and social skills and motivation to develop and expand the client base',
    pos2Req5: 'Fluency in Finnish and English required. Other language skills are beneficial',
    pos2Req6: 'In-depth knowledge of the local market situation and skills to aid clients throughout the whole buying / selling process',
    pos2Req7: 'Established territory in some of following areas: Lapland/ Turku / Tampere / Southern Archipelago / Lake District',
    pos2OfferTitle: 'We Offer:',
    pos2Offer1: 'Competitive performance based commission',
    pos2Offer2: 'Powerful marketing tools on a local and global basis',
    pos2Offer3: 'International sales channels',
    pos2Offer4: 'A great experience and opportunity to grow with a global company',
    pos2Offer5: 'Possibility to work with international clients',
    pos2Offer6: 'Support your career as a real estate professional',
    pos2Offer7: 'Possibility to work within different segments / property types',
    pos2Offer8: 'A network of regional sales representatives',
    pos2Location: 'Location: Helsinki, Finland',
    contactName: 'Robert Charpentier',
    contactTitle: 'Chairman, M.Sc., LKV',
    contactPhone: '+358 (0)400 243 011',
    contactEmail: 'robert@sothebysrealty.fi',
    contactCta: 'Are you the one we are looking for? Connect with us and send us your application as soon as possible.',
    applyBtn: 'Apply for this job',
    readMore: 'Read more »',
    forMoreInfo: 'For more information:',
  },
  en: {
    title: 'Join Us',
    heroTitle: 'Welcome to Snellman Sotheby\'s International Realty',
    heroIntro: 'We represent and sell extraordinary homes in a variety of categories and price points. The mission in our daily work as real estate professionals is to Artfully Unite Extraordinary Homes with Extraordinary Lives',
    heroText1: 'Sotheby\'s International Realty® is recognized as an aspirational brand serving the luxury market. Regardless of what lifestyle desires you the most, we are here to serve you.',
    heroText2: 'Luxury is not a price point, it is a lifestyle',
    heroText3: 'As a broker in our sales team you have a great opportunity to build your own career on properties that suits your profile best.',
    wishTitle: 'Wish to join us?',
    wishSubtitle: 'Our Career opportunities.',
    pos1Category: 'Real Estate & Sales',
    pos1Title: 'Local Real Estate & Sales Professional',
    pos1Intro: 'Our network of luxury real estate agents provides unrivaled access to distinctive properties around the world. To represent a home of distinction requires highly-qualified real estate professionals with global reach and local expertise.',
    pos1Description: 'Snellman Sotheby\'s International Realty is growing and we are constantly looking for professionals to join our sales team. We are now welcoming 2-3 new real estate agents to join our company.\n\nThis is an opportunity to work for a successful, growing company with a strong global presence and a powerful brand. We highly value motivation and a positive team spirit as well as enthusiasm to help our company grow. You will work independently while still be part of a great team.',
    pos1ReqTitle: 'We Require:',
    pos1Req1: 'Licensed real estate brokers LKV with proven sales record',
    pos1Req2: 'Minimum 2+ years of experience as a real estate broker on the Finnish market, preferably in the Greater Helsinki area',
    pos1Req3: 'A special touch for luxury and premium customer focus',
    pos1Req4: 'Strong people and social skills with the motivation to develop and expand the client base',
    pos1Req5: 'Fluency in Finnish and English required. Other language skills are beneficial.',
    pos1Req6: 'In-depth knowledge of the current market situation and skills to aid clients throughout the whole buying / selling process',
    pos1Req7: 'Working knowledge of Microsoft Office Suite as well as local listing programs and general computer usage. Note! We work in an Apple environment',
    pos1OfferTitle: 'We offer:',
    pos1Offer1: 'Competitive performance based commission',
    pos1Offer2: 'Powerful marketing tools on a local and global basis',
    pos1Offer3: 'The finest looking office in town (in a very central location)',
    pos1Offer4: 'An inspiring work environment with the most powerful brand in the world',
    pos1Offer5: 'To work with international clients',
    pos1Offer6: 'A great experience and opportunity to grow with an international company',
    pos1Offer7: 'Possibility to specialize within different segments / property types',
    pos1Offer8: 'Fun co-workers 🙂',
    pos1Location: 'Location: Helsinki, Finland',
    pos2Category: 'Area Representation',
    pos2Title: 'Real Estate Area Representative',
    pos2Intro: 'Our office may be located physically in Helsinki but our commitment covers the entire country. Our listings are situated all over Finland and require experienced area representatives. We are partnering with local brokers to support us with the sales process.',
    pos2Description: 'Snellman Sotheby\'s International Realty is growing and we are constantly looking for professionals to join our sales team. Our office is located in central Helsinki, but our operations reach the whole country. We have incredible homes for sale all over Finland, and we need local / seasonal professionals to serve and represent us on specific markets.',
    pos2ReqTitle: 'We Require:',
    pos2Req1: 'Licensed real estate broker LKV',
    pos2Req2: 'Minimum 2+ years of experience as a real estate broker on the Finnish market',
    pos2Req3: 'A special touch for luxury and premium customer focus',
    pos2Req4: 'Strong people and social skills and motivation to develop and expand the client base',
    pos2Req5: 'Fluency in Finnish and English required. Other language skills are beneficial',
    pos2Req6: 'In-depth knowledge of the local market situation and skills to aid clients throughout the whole buying / selling process',
    pos2Req7: 'Established territory in some of following areas: Lapland/ Turku / Tampere / Southern Archipelago / Lake District',
    pos2OfferTitle: 'We Offer:',
    pos2Offer1: 'Competitive performance based commission',
    pos2Offer2: 'Powerful marketing tools on a local and global basis',
    pos2Offer3: 'International sales channels',
    pos2Offer4: 'A great experience and opportunity to grow with a global company',
    pos2Offer5: 'Possibility to work with international clients',
    pos2Offer6: 'Support your career as a real estate professional',
    pos2Offer7: 'Possibility to work within different segments / property types',
    pos2Offer8: 'A network of regional sales representatives',
    pos2Location: 'Location: Helsinki, Finland',
    contactName: 'Robert Charpentier',
    contactTitle: 'Chairman, M.Sc., LKV',
    contactPhone: '+358 (0)400 243 011',
    contactEmail: 'robert@sothebysrealty.fi',
    contactCta: 'Are you the one we are looking for? Connect with us and send us your application as soon as possible.',
    applyBtn: 'Apply for this job',
    readMore: 'Read more »',
    forMoreInfo: 'For more information:',
  },
};

interface CareersPageProps {
  params: { locale: Locale };
}

export default function CareersPage({ params }: CareersPageProps) {
  const { locale } = params;
  const t = translations[locale] || translations.fi;

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-8 text-center">
            {t.heroTitle}
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-6 text-center max-w-4xl mx-auto">
            {t.heroIntro}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-6 text-center max-w-4xl mx-auto">
            {t.heroText1}
          </p>
          <p className="text-xl font-light text-gray-900 mb-6 text-center italic">
            {t.heroText2}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
            {t.heroText3}
          </p>
        </div>
      </section>

      {/* Wish to Join Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-2">
            {t.wishTitle}
          </h2>
          <p className="text-xl text-gray-700">
            {t.wishSubtitle}
          </p>
        </div>
      </section>

      {/* Positions Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Position 1 */}
            <div className="bg-white border border-gray-200 p-8">
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">{t.pos1Category}</p>
                <h3 className="text-2xl font-normal text-gray-900 mb-4">
                  {t.pos1Title}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t.pos1Intro}
                </p>
                <a
                  href="#position1-details"
                  className="text-[#002349] hover:underline font-light"
                >
                  {t.readMore}
                </a>
              </div>
            </div>

            {/* Position 2 */}
            <div className="bg-white border border-gray-200 p-8">
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">{t.pos2Category}</p>
                <h3 className="text-2xl font-normal text-gray-900 mb-4">
                  {t.pos2Title}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t.pos2Intro}
                </p>
                <a
                  href="#position2-details"
                  className="text-[#002349] hover:underline font-light"
                >
                  {t.readMore}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Position 1 Details */}
      <section id="position1-details" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h3 className="text-3xl font-light text-gray-900 mb-6">
            {t.pos1Title}
          </h3>
          <p className="text-gray-700 leading-relaxed mb-8 whitespace-pre-line">
            {t.pos1Description}
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-normal text-gray-900 mb-4">
                {t.pos1ReqTitle}
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos1Req1}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos1Req2}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos1Req3}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos1Req4}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos1Req5}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos1Req6}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos1Req7}</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-normal text-gray-900 mb-4">
                {t.pos1OfferTitle}
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos1Offer1}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos1Offer2}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos1Offer3}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos1Offer4}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos1Offer5}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos1Offer6}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos1Offer7}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos1Offer8}</span>
                </li>
              </ul>
            </div>
          </div>

          <p className="text-gray-700 mb-6">{t.pos1Location}</p>

          <div className="bg-white border-l-4 border-[#002349] p-6 mb-6">
            <p className="font-normal text-gray-900 mb-2">{t.forMoreInfo}</p>
            <p className="text-gray-900 font-normal">{t.contactName}</p>
            <p className="text-gray-700">{t.contactTitle}</p>
            <p className="text-gray-700">{t.contactPhone}</p>
            <p className="text-gray-700">
              <a href={`mailto:${t.contactEmail}`} className="text-[#002349] hover:underline">
                {t.contactEmail}
              </a>
            </p>
          </div>

          <p className="text-gray-700 mb-6">{t.contactCta}</p>
          <a
            href={`mailto:${t.contactEmail}`}
            className="inline-block bg-[#002349] text-white px-8 py-3
                     hover:bg-[#001731] transition-colors duration-300
                     font-light uppercase tracking-wider text-sm"
          >
            {t.applyBtn}
          </a>
        </div>
      </section>

      {/* Position 2 Details */}
      <section id="position2-details" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h3 className="text-3xl font-light text-gray-900 mb-6">
            {t.pos2Title}
          </h3>
          <p className="text-gray-700 leading-relaxed mb-8">
            {t.pos2Description}
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-normal text-gray-900 mb-4">
                {t.pos2ReqTitle}
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos2Req1}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos2Req2}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos2Req3}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos2Req4}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos2Req5}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos2Req6}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos2Req7}</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-normal text-gray-900 mb-4">
                {t.pos2OfferTitle}
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos2Offer1}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos2Offer2}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos2Offer3}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos2Offer4}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos2Offer5}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos2Offer6}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos2Offer7}</span>
                </li>
                <li className="flex items-start text-gray-700">
                  <span className="mr-2">•</span>
                  <span>{t.pos2Offer8}</span>
                </li>
              </ul>
            </div>
          </div>

          <p className="text-gray-700 mb-6">{t.pos2Location}</p>

          <div className="bg-gray-50 border-l-4 border-[#002349] p-6 mb-6">
            <p className="font-normal text-gray-900 mb-2">{t.forMoreInfo}</p>
            <p className="text-gray-900 font-normal">{t.contactName}</p>
            <p className="text-gray-700">{t.contactTitle}</p>
            <p className="text-gray-700">{t.contactPhone}</p>
            <p className="text-gray-700">
              <a href={`mailto:${t.contactEmail}`} className="text-[#002349] hover:underline">
                {t.contactEmail}
              </a>
            </p>
          </div>

          <p className="text-gray-700 mb-6">{t.contactCta}</p>
          <a
            href={`mailto:${t.contactEmail}`}
            className="inline-block bg-[#002349] text-white px-8 py-3
                     hover:bg-[#001731] transition-colors duration-300
                     font-light uppercase tracking-wider text-sm"
          >
            {t.applyBtn}
          </a>
        </div>
      </section>
    </main>
  );
}

export async function generateMetadata({ params }: CareersPageProps) {
  const { locale } = params;
  const t = translations[locale] || translations.fi;
  
  return {
    title: `${t.title} | Snellman Sotheby's International Realty`,
    description: t.heroIntro,
  };
}
