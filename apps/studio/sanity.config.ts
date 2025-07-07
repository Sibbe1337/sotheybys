import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'sothebys-rebuild',
  title: 'SothebysRealty.fi CMS',
  
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
  dataset: process.env.SANITY_STUDIO_DATASET || 'prod',
  
  plugins: [
    deskTool({
      structure: (S, context) => {
        return S.list()
          .title('Content')
          .items([
            // Orderable listing overrides
            orderableDocumentListDeskItem({
              type: 'listingOverride',
              title: 'Featured Listings',
              icon: () => '⭐',
              S,
              context,
            }),
            S.divider(),
            // Regular document types
            S.listItem()
              .title('Pages')
              .icon(() => '📄')
              .child(S.documentTypeList('page')),
            S.listItem()
              .title('Global Settings')
              .icon(() => '⚙️')
              .child(S.document().schemaType('globalSettings').documentId('globalSettings')),
            S.divider(),
            // Other document types
            ...S.documentTypeListItems()
              .filter(listItem => !['listingOverride', 'page', 'globalSettings'].includes(listItem.getId()!))
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