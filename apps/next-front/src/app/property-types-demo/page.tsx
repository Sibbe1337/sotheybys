'use client';

import { useState, useEffect } from 'react';
import { 
  MultilingualPropertyListing, 
  getLocalizedValue, 
  formatPriceLocalized,
  formatAreaLocalized,
  SupportedLanguage 
} from '@/lib/property-types-multilang';

export default function PropertyTypesDemoPage() {
  const [language, setLanguage] = useState<SupportedLanguage>('fi');
  const [properties, setProperties] = useState<MultilingualPropertyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawData, setRawData] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/property-types-demo?lang=${language}`);
        const data = await response.json();

        if (data.success) {
          setProperties(data.allMapped || []);
          setRawData(data);
        } else {
          setError(data.error || 'Failed to load data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [language]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-[#002349] mb-4">
            Property Types Demo
          </h1>
          <p className="text-gray-600 mb-6">
            Demonstrating multilingual property data from Linear.fi API
          </p>

          {/* Language Selector */}
          <div className="flex gap-4">
            <button
              onClick={() => setLanguage('fi')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                language === 'fi'
                  ? 'bg-[#002349] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🇫🇮 Suomi
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                language === 'en'
                  ? 'bg-[#002349] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => setLanguage('sv')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                language === 'sv'
                  ? 'bg-[#002349] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🇸🇪 Svenska
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002349] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading property data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h3 className="text-red-800 font-semibold mb-2">Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Success State */}
        {!loading && !error && properties.length > 0 && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl font-bold text-[#002349] mb-2">
                  {properties.length}
                </div>
                <div className="text-gray-600">
                  {language === 'fi' ? 'Kohdetta' : language === 'en' ? 'Properties' : 'Fastigheter'}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl font-bold text-[#002349] mb-2">
                  {language === 'fi' ? 'Suomi' : language === 'en' ? 'English' : 'Svenska'}
                </div>
                <div className="text-gray-600">
                  {language === 'fi' ? 'Valittu kieli' : language === 'en' ? 'Selected Language' : 'Valt språk'}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl font-bold text-[#002349] mb-2">
                  100+
                </div>
                <div className="text-gray-600">
                  {language === 'fi' ? 'Tietokenttää' : language === 'en' ? 'Data Fields' : 'Datafält'}
                </div>
              </div>
            </div>

            {/* Property Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {properties.map((property, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Image */}
                  {property.photoUrls && property.photoUrls.length > 0 && (
                    <div className="relative h-48 bg-gray-200">
                      <img
                        src={property.photoUrls[0]}
                        alt={getLocalizedValue(property.heading, language)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#002349] mb-2">
                      {getLocalizedValue(property.heading, language)}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {getLocalizedValue(property.streetAddress, language)}, {getLocalizedValue(property.city, language)}
                    </p>

                    {/* Stats */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {language === 'fi' ? 'Hinta' : language === 'en' ? 'Price' : 'Pris'}:
                        </span>
                        <span className="font-semibold text-[#002349]">
                          {formatPriceLocalized(property.salesPrice, language)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {language === 'fi' ? 'Pinta-ala' : language === 'en' ? 'Area' : 'Yta'}:
                        </span>
                        <span className="font-semibold">
                          {formatAreaLocalized(property.livingArea, language)}
                        </span>
                      </div>
                      {property.energyClass && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {language === 'fi' ? 'Energialuokka' : language === 'en' ? 'Energy Class' : 'Energiklass'}:
                          </span>
                          <span className="font-semibold">{property.energyClass}</span>
                        </div>
                      )}
                    </div>

                    {/* Amenities */}
                    <div className="flex gap-2 flex-wrap">
                      {property.sauna && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {language === 'fi' ? '🧖 Sauna' : language === 'en' ? '🧖 Sauna' : '🧖 Bastu'}
                        </span>
                      )}
                      {property.balcony && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          {language === 'fi' ? '🪴 Parveke' : language === 'en' ? '🪴 Balcony' : '🪴 Balkong'}
                        </span>
                      )}
                      {property.energyCertificate && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          ⚡ {language === 'fi' ? 'Energiatodistus' : language === 'en' ? 'Energy Cert' : 'Energicert'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Raw Data (Collapsible) */}
            <details className="bg-white rounded-lg shadow-lg p-6">
              <summary className="cursor-pointer font-semibold text-[#002349] mb-4">
                {language === 'fi' ? '🔍 Näytä raakamuotoinen data' : 
                 language === 'en' ? '🔍 Show Raw Data' : 
                 '🔍 Visa rådata'}
              </summary>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-xs">
                {JSON.stringify(rawData, null, 2)}
              </pre>
            </details>

            {/* Field Overview */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
              <h2 className="text-2xl font-bold text-[#002349] mb-4">
                {language === 'fi' ? '📊 Tietokenttien yhteenveto' : 
                 language === 'en' ? '📊 Data Fields Overview' : 
                 '📊 Datafältöversikt'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded p-4">
                  <h3 className="font-semibold mb-2">
                    {language === 'fi' ? '1. Yleistiedot' : 
                     language === 'en' ? '1. General Info' : 
                     '1. Allmän information'}
                  </h3>
                  <p className="text-sm text-gray-600">24 {language === 'fi' ? 'kenttää' : language === 'en' ? 'fields' : 'fält'}</p>
                </div>
                <div className="border rounded p-4">
                  <h3 className="font-semibold mb-2">
                    {language === 'fi' ? '2. Mitat' : 
                     language === 'en' ? '2. Dimensions' : 
                     '2. Dimensioner'}
                  </h3>
                  <p className="text-sm text-gray-600">9 {language === 'fi' ? 'kenttää' : language === 'en' ? 'fields' : 'fält'}</p>
                </div>
                <div className="border rounded p-4">
                  <h3 className="font-semibold mb-2">
                    {language === 'fi' ? '3. Taloudelliset tiedot' : 
                     language === 'en' ? '3. Financial Data' : 
                     '3. Ekonomisk data'}
                  </h3>
                  <p className="text-sm text-gray-600">14 {language === 'fi' ? 'kenttää' : language === 'en' ? 'fields' : 'fält'}</p>
                </div>
                <div className="border rounded p-4">
                  <h3 className="font-semibold mb-2">
                    {language === 'fi' ? '4. Yhtiö / Hallinta' : 
                     language === 'en' ? '4. Company / Management' : 
                     '4. Företag / Förvaltning'}
                  </h3>
                  <p className="text-sm text-gray-600">18 {language === 'fi' ? 'kenttää' : language === 'en' ? 'fields' : 'fält'}</p>
                </div>
                <div className="border rounded p-4">
                  <h3 className="font-semibold mb-2">
                    {language === 'fi' ? '5. Tekniset tiedot' : 
                     language === 'en' ? '5. Technical Data' : 
                     '5. Teknisk data'}
                  </h3>
                  <p className="text-sm text-gray-600">16 {language === 'fi' ? 'kenttää' : language === 'en' ? 'fields' : 'fält'}</p>
                </div>
                <div className="border rounded p-4">
                  <h3 className="font-semibold mb-2">
                    {language === 'fi' ? '6. Ilmoitus- ja välittäjätiedot' : 
                     language === 'en' ? '6. Listing & Agent Info' : 
                     '6. Annons- och mäklarinfo'}
                  </h3>
                  <p className="text-sm text-gray-600">9 {language === 'fi' ? 'kenttää' : language === 'en' ? 'fields' : 'fält'}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

