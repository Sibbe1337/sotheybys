'use client';

import { useEffect, useState } from 'react';

export default function DebugDataPage() {
  const [rawData, setRawData] = useState<any>(null);
  const [convertedData, setConvertedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Get raw Linear API data via our API route
        const rawResponse = await fetch('/api/listings?format=raw&source=test');
        if (!rawResponse.ok) {
          throw new Error('Failed to fetch raw data');
        }
        const rawResult = await rawResponse.json();
        setRawData(rawResult.data);
        
        // Get converted data from cache via our API route
        const cachedResponse = await fetch('/api/listings?format=wordpress&source=cache&lang=fi');
        if (!cachedResponse.ok) {
          throw new Error('Failed to fetch cached data');
        }
        const cachedResult = await cachedResponse.json();
        setConvertedData(cachedResult.data);
      } catch (error) {
        console.error('Error loading data:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  
  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-red-600">Error Loading Data</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

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
