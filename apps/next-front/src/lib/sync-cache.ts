// Store the last sync time and cached data
let lastSyncTime: Date | null = null;
let cachedListings: any[] = [];
let syncInProgress = false;

export function getCachedListings() {
  return cachedListings;
}

export function getLastSyncTime() {
  return lastSyncTime;
}

export function setSyncData(listings: any[], time: Date) {
  cachedListings = listings;
  lastSyncTime = time;
}

export function isSyncInProgress() {
  return syncInProgress;
}

export function setSyncInProgress(inProgress: boolean) {
  syncInProgress = inProgress;
}

