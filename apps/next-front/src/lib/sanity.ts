import { createClient } from '@sanity/client'

export const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion:process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn:    process.env.NODE_ENV === 'production'
})

export const getPageBySlug = (slug: string) =>
  sanity.fetch(`*[_type=="page" && slug.current==$slug][0]`, { slug })

export const getAllListings = () =>
  sanity.fetch(`*[_type=="listing"] | order(_createdAt desc)`)
