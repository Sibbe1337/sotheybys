import { listingOverride } from './documents/listingOverride';
import { page } from './documents/page';
import { globalSettings } from './singletons/globalSettings';

export const schemaTypes = [
  // Documents
  listingOverride,
  page,
  
  // Singletons
  globalSettings,
]; 