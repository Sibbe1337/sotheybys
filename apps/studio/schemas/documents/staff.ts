import { defineType, defineField } from 'sanity';

export const staff = defineType({
  name: 'staff',
  title: 'Staff Member',
  type: 'document',
  icon: () => '👤',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'object',
      fields: [
        { name: 'fi', type: 'string', title: 'Finnish' },
        { name: 'sv', type: 'string', title: 'Swedish' },
        { name: 'en', type: 'string', title: 'English' },
      ],
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'email',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Profile Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          validation: Rule => Rule.required(),
        },
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'object',
      fields: [
        {
          name: 'fi',
          type: 'array',
          title: 'Finnish',
          of: [{ type: 'block' }],
        },
        {
          name: 'sv',
          type: 'array',
          title: 'Swedish',
          of: [{ type: 'block' }],
        },
        {
          name: 'en',
          type: 'array',
          title: 'English',
          of: [{ type: 'block' }],
        },
      ],
    }),
    defineField({
      name: 'languages',
      title: 'Language Flags',
      type: 'array',
      description: 'Language codes shown as flags (e.g. fi, se, gb, fr, de)',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: '🇫🇮 Finnish', value: 'fi' },
          { title: '🇸🇪 Swedish', value: 'se' },
          { title: '🇬🇧 English', value: 'gb' },
          { title: '🇫🇷 French', value: 'fr' },
          { title: '🇩🇪 German', value: 'de' },
          { title: '🇷🇺 Russian', value: 'ru' },
          { title: '🇪🇪 Estonian', value: 'ee' },
          { title: '🇮🇷 Persian', value: 'ir' },
          { title: '🇹🇷 Turkish', value: 'tr' },
        ],
      },
    }),
    defineField({
      name: 'specialization',
      title: 'Specialization',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Luxury Properties', value: 'luxury' },
          { title: 'Apartments', value: 'apartments' },
          { title: 'Villas', value: 'villas' },
          { title: 'Commercial', value: 'commercial' },
        ],
      },
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      validation: Rule => Rule.required().min(0),
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Show this staff member on the website',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      role: 'role.en',
      media: 'photo',
      active: 'active',
    },
    prepare({ title, role, media, active }) {
      return {
        title,
        subtitle: `${role || 'Staff'} ${active ? '🟢' : '🔴'}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
});

