'use client';

import { useState, useEffect } from 'react';

interface SyncStatus {
  cacheStatus: {
    listingsCount: number;
    lastSyncTime: string;
    syncInProgress: boolean;
    autoSyncActive: boolean;
    needsRefresh: boolean;
  };
  statistics: {
    totalListings: number;
    listingsByStatus: Record<string, number>;
    recentListingsCount: number;
    recentListings: Array<{
      identifier: string;
      address: string;
      publishDate: string;
      price: string;
    }>;
  };
  syncConfiguration: {
    syncInterval: string;
    cacheEnabled: boolean;
    apiEndpoint: string;
  };
}

export default function SyncMonitorPage() {
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/sync-status');
      if (!response.ok) throw new Error('Failed to fetch status');
      const data = await response.json();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const triggerSync = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/sync-listings', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to trigger sync');
      await fetchStatus(); // Refresh status after sync
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to trigger sync');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002349] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading sync status...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-red-800 font-medium">Error loading sync status</h3>
            <p className="text-red-600 mt-2">{error}</p>
            <button
              onClick={fetchStatus}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const lastSyncTime = status?.cacheStatus.lastSyncTime 
    ? new Date(status.cacheStatus.lastSyncTime).toLocaleString('fi-FI')
    : 'Never';

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900">Linear API Sync Monitor</h1>
          <p className="text-gray-600 mt-2">Monitor and manage property listings synchronization</p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Listings</h3>
            <p className="text-3xl font-light text-gray-900 mt-2">{status?.cacheStatus.listingsCount || 0}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Last Sync</h3>
            <p className="text-lg font-light text-gray-900 mt-2">{lastSyncTime}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Auto-Sync Status</h3>
            <div className="mt-2 flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                status?.cacheStatus.autoSyncActive ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-lg font-light text-gray-900">
                {status?.cacheStatus.autoSyncActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Sync Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-light text-gray-900 mb-4">Sync Actions</h2>
          <div className="flex gap-4">
            <button
              onClick={triggerSync}
              disabled={syncing || status?.cacheStatus.syncInProgress}
              className={`px-6 py-3 rounded font-light transition-colors ${
                syncing || status?.cacheStatus.syncInProgress
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#002349] text-white hover:bg-[#001a2d]'
              }`}
            >
              {syncing || status?.cacheStatus.syncInProgress ? 'Syncing...' : 'Trigger Manual Sync'}
            </button>
            
            <button
              onClick={fetchStatus}
              className="px-6 py-3 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 font-light"
            >
              Refresh Status
            </button>
          </div>
          
          {status?.cacheStatus.needsRefresh && (
            <p className="mt-4 text-amber-600 text-sm">
              ⚠️ Cache is stale and needs refresh
            </p>
          )}
        </div>

        {/* Listings by Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-light text-gray-900 mb-4">Listings by Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(status?.statistics.listingsByStatus || {}).map(([statusKey, count]) => (
              <div key={statusKey} className="text-center p-4 bg-gray-50 rounded">
                <p className="text-2xl font-light text-gray-900">{count}</p>
                <p className="text-sm text-gray-600 capitalize">{statusKey}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Listings */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-light text-gray-900 mb-4">
            Recent Listings ({status?.statistics.recentListingsCount || 0} in last 7 days)
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Published
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {status?.statistics.recentListings.map((listing) => (
                  <tr key={listing.identifier}>
                    <td className="px-4 py-3 text-sm text-gray-900">{listing.identifier}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{listing.address}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{listing.price}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(listing.publishDate).toLocaleDateString('fi-FI')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Configuration */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-light text-gray-900 mb-4">Configuration</h2>
          <dl className="grid grid-cols-1 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Sync Interval</dt>
              <dd className="text-sm text-gray-900">{status?.syncConfiguration.syncInterval}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Cache Enabled</dt>
              <dd className="text-sm text-gray-900">
                {status?.syncConfiguration.cacheEnabled ? 'Yes' : 'No'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">API Endpoint</dt>
              <dd className="text-sm text-gray-900 break-all">{status?.syncConfiguration.apiEndpoint}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
