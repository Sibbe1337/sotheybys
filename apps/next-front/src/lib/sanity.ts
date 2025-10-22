import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'uy5hhchg',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_READ_TOKEN, // För private data
});

// Helper för image URLs
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}

// GROQ queries
export const queries = {
  // Hämta alla aktiva staff members
  staff: `*[_type == "staff" && active == true] | order(order asc) {
    _id,
    name,
    slug,
    role,
    email,
    phone,
    photo,
    bio,
    specialization,
    order
  }`,
  
  // Hämta sida med slug
  pageBySlug: (slug: string) => `*[_type == "page" && slug.current == "${slug}"][0] {
    _id,
    title,
    slug,
    content,
    seo,
    publishedAt
  }`,
  
  // Hämta global settings
  globalSettings: `*[_type == "globalSettings"][0] {
    title,
    description,
    contact,
    social,
    seo,
    analytics,
    logo,
    colors
  }`,
};
