// CMS-ready content abstraction layer
// This module provides a unified interface for content access,
// making it easy to switch between different data sources (WordPress, Sanity, etc.)

export interface Listing {
  id: string;
  title: string;
  slug: string;
  price?: number;
  address?: string;
  city?: string;
  postalCode?: string;
  sizes?: {
    area?: number;
    rooms?: number;
    bedrooms?: number;
    bathrooms?: number;
  };
  youtubeUrl?: string;
  virtualTourUrl?: string;
  brochureUrl?: string;
  floorplanUrl?: string;
  internationalUrl?: string;
  auctionUrl?: string;
  type?: string;
  propertyType?: string;
  status?: string;
  description?: string;
  images?: Array<{
    url: string;
    alt?: string;
    caption?: string;
  }>;
  agent?: Agent;
  marketingContent?: {
    title?: string;
    subtitle?: string;
    highlights?: string[];
    sellingPoints?: string[];
    locationDescription?: string;
  };
  metadata?: {
    publishDate?: string;
    lastModified?: string;
    featured?: boolean;
  };
}

export interface Agent {
  id: string;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  bio?: string;
  languages?: string[];
  specialties?: string[];
  listings?: Listing[];
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface SearchFilters {
  priceMin?: number;
  priceMax?: number;
  areaMin?: number;
  areaMax?: number;
  propertyType?: string;
  city?: string;
  bedrooms?: number;
  bathrooms?: number;
  agentId?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'date' | 'area';
  sortOrder?: 'asc' | 'desc';
}

// Currently using WordPress/Linear API - replace implementations when switching to another CMS
import { getClient } from './wordpress';
import { fetchLinearListings, fetchTestLinearListings } from './linear-api-adapter';
import { gql } from '@apollo/client';

// TODO: Replace with actual GraphQL queries when switching CMS
const GET_LISTINGS_QUERY = gql`
  query GetListings($first: Int = 100) {
    posts(first: $first, where: { categoryName: "properties" }) {
      nodes {
        id
        title
        slug
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        acfRealEstate {
          property {
            price
            address
            city
            bedrooms
            bathrooms
            area
            propertyType
            status
            description
          }
          agent {
            name
            email
            phone
            photo {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  }
`;

const GET_LISTING_QUERY = gql`
  query GetListing($slug: String!) {
    postBy(slug: $slug) {
      id
      title
      slug
      content
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      acfRealEstate {
        property {
          price
          address
          city
          bedrooms
          bathrooms
          area
          propertyType
          status
          description
          youtubeUrl
          virtualTourUrl
          brochureUrl
          floorplanUrl
          internationalBrochureUrl
          auctionUrl
        }
        agent {
          name
          email
          phone
          bio
          photo {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

/**
 * Fetch all listings with optional filters and pagination
 * TODO: Implement filtering and pagination when switching to a more capable CMS
 */
export async function getListings(
  filters?: SearchFilters,
  pagination?: PaginationOptions
): Promise<Listing[]> {
  try {
    // Try Linear API first
    const linearListings = await fetchLinearListings();
    if (linearListings && linearListings.length > 0) {
      return linearListings.map(mapLinearListingToListing);
    }

    // Fallback to test API
    const testListings = await fetchTestLinearListings();
    if (testListings && testListings.length > 0) {
      return testListings.map(mapLinearListingToListing);
    }

    // Fallback to WordPress
    const client = getClient();
    const { data } = await client.query({
      query: GET_LISTINGS_QUERY,
      variables: { first: pagination?.limit || 100 }
    });

    return data.posts.nodes.map(mapWordPressListingToListing);
  } catch (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
}

/**
 * Fetch a single listing by slug
 */
export async function getListing(slug: string): Promise<Listing | null> {
  try {
    // Try Linear API first
    const allListings = await getListings();
    const linearListing = allListings.find(l => l.slug === slug);
    if (linearListing) {
      return linearListing;
    }

    // Fallback to WordPress
    const client = getClient();
    const { data } = await client.query({
      query: GET_LISTING_QUERY,
      variables: { slug }
    });

    if (!data.postBy) {
      return null;
    }

    return mapWordPressListingToListing(data.postBy);
  } catch (error) {
    console.error('Error fetching listing:', error);
    return null;
  }
}

/**
 * Fetch all agents
 * TODO: Implement proper agent fetching when CMS supports it
 */
export async function getAgents(): Promise<Agent[]> {
  // For now, extract unique agents from listings
  const listings = await getListings();
  const agentMap = new Map<string, Agent>();

  listings.forEach(listing => {
    if (listing.agent && !agentMap.has(listing.agent.id)) {
      agentMap.set(listing.agent.id, listing.agent);
    }
  });

  return Array.from(agentMap.values());
}

/**
 * Fetch a single agent by ID or slug
 * TODO: Implement proper agent fetching when CMS supports it
 */
export async function getAgent(idOrSlug: string): Promise<Agent | null> {
  const agents = await getAgents();
  return agents.find(a => a.id === idOrSlug || slugify(a.name) === idOrSlug) || null;
}

// Helper function to map Linear API listing to our Listing interface
function mapLinearListingToListing(linearListing: any): Listing {
  const property = linearListing.acfRealEstate?.property || {};
  const agent = linearListing.acfRealEstate?.agent || {};

  return {
    id: linearListing.id,
    title: linearListing.title,
    slug: linearListing.slug,
    price: property.price ? Number(property.price) : undefined,
    address: property.address,
    city: property.city,
    sizes: {
      area: property.area ? Number(property.area) : undefined,
      rooms: property.rooms ? Number(property.rooms) : undefined,
      bedrooms: property.bedrooms ? Number(property.bedrooms) : undefined,
      bathrooms: property.bathrooms ? Number(property.bathrooms) : undefined,
    },
    propertyType: property.propertyType,
    status: property.status,
    description: property.description,
    images: linearListing.featuredImage ? [{
      url: linearListing.featuredImage.node.sourceUrl,
      alt: linearListing.featuredImage.node.altText
    }] : [],
    agent: agent.name ? {
      id: agent.email || slugify(agent.name),
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      photoUrl: agent.photo?.sourceUrl
    } : undefined
  };
}

// Helper function to map WordPress listing to our Listing interface
function mapWordPressListingToListing(wpListing: any): Listing {
  const property = wpListing.acfRealEstate?.property || {};
  const agent = wpListing.acfRealEstate?.agent || {};

  return {
    id: wpListing.id,
    title: wpListing.title,
    slug: wpListing.slug,
    price: property.price ? Number(property.price) : undefined,
    address: property.address,
    city: property.city,
    postalCode: property.postalCode,
    sizes: {
      area: property.area ? Number(property.area) : undefined,
      rooms: property.rooms ? Number(property.rooms) : undefined,
      bedrooms: property.bedrooms ? Number(property.bedrooms) : undefined,
      bathrooms: property.bathrooms ? Number(property.bathrooms) : undefined,
    },
    youtubeUrl: property.youtubeUrl,
    virtualTourUrl: property.virtualTourUrl,
    brochureUrl: property.brochureUrl,
    floorplanUrl: property.floorplanUrl,
    internationalUrl: property.internationalBrochureUrl,
    auctionUrl: property.auctionUrl,
    propertyType: property.propertyType,
    status: property.status,
    description: property.description,
    images: wpListing.featuredImage ? [{
      url: wpListing.featuredImage.node.sourceUrl,
      alt: wpListing.featuredImage.node.altText
    }] : [],
    agent: agent.name ? {
      id: agent.email || slugify(agent.name),
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      photoUrl: agent.photo?.sourceUrl,
      bio: agent.bio
    } : undefined
  };
}

// Helper function to create slugs from names
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äå]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
