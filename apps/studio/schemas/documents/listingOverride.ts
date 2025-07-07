import { defineType, defineField } from 'sanity';

export const listingOverride = defineType({
  name: 'listingOverride',
  title: 'Listing Override',
  type: 'document',
  icon: () => '⭐',
  description: 'Override display settings and order for property listings',
  fields: [
    defineField({
      name: 'linearId',
      title: 'Linear Property ID',
      type: 'string',
      description: 'The ID from Linear API',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Custom Title',
      type: 'string',
      description: 'Override the title from Linear (optional)',
    }),
    defineField({
      name: 'description',
      title: 'Custom Description',
      type: 'text',
      description: 'Override the description from Linear (optional)',
      rows: 3,
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Mark as featured property',
      initialValue: false,
    }),
    defineField({
      name: 'priority',
      title: 'Priority',
      type: 'number',
      description: 'Display priority (higher = shown first)',
      initialValue: 0,
    }),
    defineField({
      name: 'customImages',
      title: 'Custom Images',
      type: 'array',
      description: 'Override images from Linear (optional)',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Hidden', value: 'hidden' },
          { title: 'Coming Soon', value: 'coming_soon' },
        ],
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Additional tags for filtering',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      linearId: 'linearId',
      featured: 'featured',
      priority: 'priority',
      status: 'status',
    },
    prepare(selection) {
      const { title, linearId, featured, priority, status } = selection;
      const subtitle = `Linear ID: ${linearId} • Priority: ${priority} • Status: ${status}`;
      return {
        title: title || `Property ${linearId}`,
        subtitle,
        media: featured ? '⭐' : '🏠',
      };
    },
  },
  orderings: [
    {
      title: 'Priority (High to Low)',
      name: 'priorityDesc',
      by: [{ field: 'priority', direction: 'desc' }],
    },
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'priority', direction: 'desc' },
      ],
    },
  ],
}); 