import { defineType, defineField } from 'sanity';

export const globalSettings = defineType({
  name: 'globalSettings',
  title: 'Global Settings',
  type: 'document',
  icon: () => '⚙️',
  description: 'Site-wide settings and customization options',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      description: 'The main title of your website',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      description: 'Default description for SEO',
      rows: 3,
    }),
    defineField({
      name: 'colors',
      title: 'Brand Colors',
      type: 'object',
      description: 'Customize the color palette for your site (use hex codes like #002349)',
      fields: [
        {
          name: 'primary',
          title: 'Primary Color',
          type: 'string',
          description: 'Main brand color for buttons, links, etc. (e.g., #002349)',
          validation: Rule => Rule.regex(/^#[0-9A-Fa-f]{6}$/, { name: 'hex color' }).error('Must be a valid hex color (e.g., #002349)'),
        },
        {
          name: 'secondary',
          title: 'Secondary Color', 
          type: 'string',
          description: 'Secondary brand color for accents (e.g., #8e740b)',
          validation: Rule => Rule.regex(/^#[0-9A-Fa-f]{6}$/, { name: 'hex color' }).error('Must be a valid hex color (e.g., #8e740b)'),
        },
        {
          name: 'background',
          title: 'Background Color',
          type: 'string',
          description: 'Main background color (e.g., #ffffff)',
          validation: Rule => Rule.regex(/^#[0-9A-Fa-f]{6}$/, { name: 'hex color' }).error('Must be a valid hex color (e.g., #ffffff)'),
        },
        {
          name: 'text',
          title: 'Text Color',
          type: 'string',
          description: 'Primary text color (e.g., #000000)',
          validation: Rule => Rule.regex(/^#[0-9A-Fa-f]{6}$/, { name: 'hex color' }).error('Must be a valid hex color (e.g., #000000)'),
        },
      ],
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Your site logo',
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
      ],
    }),
    defineField({
      name: 'contact',
      title: 'Contact Information',
      type: 'object',
      fields: [
        {
          name: 'email',
          title: 'Email',
          type: 'email',
          description: 'Main contact email',
        },
        {
          name: 'phone',
          title: 'Phone',
          type: 'string',
          description: 'Main contact phone number',
        },
        {
          name: 'address',
          title: 'Address',
          type: 'text',
          rows: 3,
          description: 'Physical address',
        },
      ],
    }),
    defineField({
      name: 'social',
      title: 'Social Media',
      type: 'object',
      fields: [
        {
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url',
        },
        {
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
        },
        {
          name: 'linkedin',
          title: 'LinkedIn URL',
          type: 'url',
        },
        {
          name: 'twitter',
          title: 'Twitter URL',
          type: 'url',
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'Default SEO',
      type: 'object',
      description: 'Default SEO settings for the entire site',
      fields: [
        {
          name: 'metaTitle',
          type: 'string',
          title: 'Default Meta Title',
          description: 'Default title for search engines',
        },
        {
          name: 'metaDescription',
          type: 'text',
          title: 'Default Meta Description',
          description: 'Default description for search engines',
          rows: 3,
        },
        {
          name: 'ogImage',
          type: 'image',
          title: 'Default Social Share Image',
          description: 'Default image for social media sharing',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'favicon',
          type: 'image',
          title: 'Favicon',
          description: 'Site favicon (32x32px recommended)',
        },
      ],
    }),
    defineField({
      name: 'analytics',
      title: 'Analytics',
      type: 'object',
      fields: [
        {
          name: 'googleAnalyticsId',
          title: 'Google Analytics ID',
          type: 'string',
          description: 'Google Analytics measurement ID (GA4)',
        },
        {
          name: 'googleTagManagerId',
          title: 'Google Tag Manager ID',
          type: 'string',
          description: 'Google Tag Manager container ID',
        },
      ],
    }),
    defineField({
      name: 'linearSync',
      title: 'Linear Integration',
      type: 'object',
      description: 'Settings for Linear API synchronization',
      fields: [
        {
          name: 'lastSyncAt',
          title: 'Last Sync',
          type: 'datetime',
          description: 'When properties were last synced from Linear',
          readOnly: true,
        },
        {
          name: 'syncStatus',
          title: 'Sync Status',
          type: 'string',
          options: {
            list: [
              { title: 'Success', value: 'success' },
              { title: 'Error', value: 'error' },
              { title: 'In Progress', value: 'in_progress' },
            ],
          },
          readOnly: true,
        },
        {
          name: 'errorMessage',
          title: 'Error Message',
          type: 'text',
          description: 'Last sync error message if any',
          readOnly: true,
          hidden: ({ parent }) => parent?.syncStatus !== 'error',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title || 'Global Settings',
        subtitle: subtitle || 'Site-wide configuration',
        media: () => '⚙️',
      };
    },
  },
}); 