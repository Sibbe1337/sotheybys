'use client';

import { useEffect, useState } from 'react';
import { fetchLinearListings } from '@/lib/linear-api-adapter';
import { listingsCache } from '@/lib/listings-cache';

export default function DebugDataPage() {
  const [rawData, setRawData] = useState<any>(null);
  const [convertedData, setConvertedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Get raw Linear API data
        const raw = await fetchLinearListings();
        setRawData(raw);
        
        // Get converted data from cache
        const cached = listingsCache.getWordPressFormattedListings('fi');
        setConvertedData(cached);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Debug: Linear API Data</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Raw Linear API Data</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-xs">
          {JSON.stringify(rawData, null, 2)}
        </pre>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Converted/Cached Data</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-xs">
          {JSON.stringify(convertedData, null, 2)}
        </pre>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Check for New Fields</h2>
        {convertedData && convertedData[0] && (
          <div className="space-y-2">
            <p>✅ Basic fields: {convertedData[0].acfRealEstate?.property?.address ? 'Present' : 'Missing'}</p>
            <p>🔍 Security System: {convertedData[0].acfRealEstate?.property?.securitySystem || 'Not found'}</p>
            <p>🔍 Internet Connection: {convertedData[0].acfRealEstate?.property?.internetConnection || 'Not found'}</p>
            <p>🔍 Water Damage: {convertedData[0].acfRealEstate?.property?.waterDamage || 'Not found'}</p>
            <p>🔍 Marketing Title: {convertedData[0].acfRealEstate?.property?.marketingTitle || 'Not found'}</p>
            <p>🔍 Condition Report: {convertedData[0].acfRealEstate?.property?.conditionReport || 'Not found'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
