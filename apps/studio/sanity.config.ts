import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'sothebys-rebuild',
  title: 'SothebysRealty.fi CMS',
  
  projectId: 'uy5hhchg',
  dataset: 'production',
  
  plugins: [
    structureTool({
      structure: (S) => {
        return S.list()
          .title('Content')
          .items([
            // Featured Listings
            S.listItem()
              .title('Featured Listings')
              .icon(() => '⭐')
              .child(S.documentTypeList('listingOverride').title('Featured Listings')),
            S.divider(),
            // Pages
            S.listItem()
              .title('Pages')
              .icon(() => '📄')
              .child(S.documentTypeList('page').title('Pages')),
            // Staff
            S.listItem()
              .title('Staff')
              .icon(() => '👤')
              .child(
                S.documentTypeList('staff')
                  .title('Staff Members')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),
            S.divider(),
            // Global Settings (Singleton)
            S.listItem()
              .title('Global Settings')
              .icon(() => '⚙️')
              .child(
                S.document()
                  .schemaType('globalSettings')
                  .documentId('globalSettings')
              ),
          ]);
      },
    }),
    visionTool(),
  ],
  
  schema: {
    types: schemaTypes,
  },
  
  document: {
    // Prevent creation of multiple global settings documents
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter(templateItem => templateItem.templateId !== 'globalSettings');
      }
      return prev;
    },
  },
}); 