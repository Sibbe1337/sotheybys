import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { 
  GET_PROPERTIES, 
  GET_PROPERTY_BY_SLUG, 
  GET_POSTS, 
  GET_POST_BY_SLUG, 
  GET_PAGE_BY_SLUG, 
  GET_SITE_SETTINGS, 
  GET_MENU_ITEMS 
} from '../graphql/queries-simple';

// Function to create Apollo Client with current environment variables
function createApolloClient() {
  // Create HTTP link
  const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || 'https://sothebysrealty.fi/graphql',
  });

  // Create auth link
  const authLink = setContext((_, { headers }) => {
    const token = process.env.WORDPRESS_JWT_AUTH_TOKEN;
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  // Create Apollo Client
  return new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
      },
      query: {
        errorPolicy: 'all',
      },
    },
  });
}

// Get client instance (creates new one each time to ensure fresh env vars)
export const getClient = () => createApolloClient();

// Type definitions for WordPress data
export interface Property {
  price?: number;
  address?: string;
  city?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  propertyType?: string;
  status?: string;
  description?: string;
  location?: {
    latitude?: number;
    longitude?: number;
    streetAddress?: string;
    city?: string;
    state?: string;
    postCode?: string;
    country?: string;
  };
  gallery?: Array<{
    sourceUrl: string;
    altText: string;
    mediaDetails?: {
      width?: number;
      height?: number;
    };
  }>;
}

export interface Agent {
  name?: string;
  phone?: string;
  email?: string;
  bio?: string;
  photo?: {
    sourceUrl: string;
    altText?: string;
    mediaDetails?: {
      width?: number;
      height?: number;
    };
  };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  date: string;
  status: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails?: {
        width?: number;
        height?: number;
      };
    };
  };
  property?: Property;
  agent?: Agent;
  categories?: {
    nodes: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  };
  tags?: {
    nodes: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  };
}

export interface SiteSettings {
  title: string;
  description: string;
  url: string;
  language: string;
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  path: string;
  target: string;
  title: string;
  cssClasses: string[];
  description: string;
  parentId: string | null;
  childItems?: {
    nodes: MenuItem[];
  };
}

// Helper functions for fetching data
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const { data } = await getClient().query({
      query: GET_SITE_SETTINGS,
    });
    
    return {
      title: data.generalSettings.title || 'Sotheby\'s Realty Finland',
      description: data.generalSettings.description || 'Premium real estate services',
      url: data.generalSettings.url || '',
      language: data.generalSettings.language || 'en',
    };
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return {
      title: 'Sotheby\'s Realty Finland',
      description: 'Premium real estate services',
      url: '',
      language: 'en',
    };
  }
}

export async function getMenuItems(location: string): Promise<MenuItem[]> {
  try {
    const { data } = await getClient().query({
      query: GET_MENU_ITEMS,
      variables: { location },
    });
    
    if (data.menus.nodes.length > 0) {
      return data.menus.nodes[0].menuItems.nodes || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
}

export async function getPosts(first = 10, after?: string): Promise<Post[]> {
  try {
    const { data } = await getClient().query({
      query: GET_POSTS,
      variables: { first, after },
    });
    
    return data.posts.nodes || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getProperties(first = 12, after?: string): Promise<Post[]> {
  try {
    const { data } = await getClient().query({
      query: GET_PROPERTIES,
      variables: { first, after },
    });
    
    return data.posts.nodes || [];
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const { data } = await getClient().query({
      query: GET_POST_BY_SLUG,
      variables: { slug },
    });
    
    return data?.post || null;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
}

export async function getPropertyBySlug(slug: string): Promise<Post | null> {
  try {
    const { data } = await getClient().query({
      query: GET_PROPERTY_BY_SLUG,
      variables: { slug },
    });
    
    return data.post || null;
  } catch (error) {
    console.error('Error fetching property by slug:', error);
    return null;
  }
}

export async function getPageBySlug(slug: string): Promise<any | null> {
  try {
    // Ensure proper URI format with leading and trailing slashes
    let uri = slug;
    if (!uri.startsWith('/')) uri = '/' + uri;
    if (!uri.endsWith('/')) uri = uri + '/';
    
    const { data } = await getClient().query({
      query: GET_PAGE_BY_SLUG,
      variables: { slug: uri },
    });
    
    return data?.page || null;
  } catch (error) {
    console.error('Error fetching page by slug:', error);
    return null;
  }
} 