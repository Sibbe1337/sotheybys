import { listingOverride } from './documents/listingOverride';
import { page } from './documents/page';
import { staff } from './documents/staff';
import { globalSettings } from './singletons/globalSettings';

export const schemaTypes = [
  // Documents
  listingOverride,
  page,
  staff,
  
  // Singletons
  globalSettings,
]; 