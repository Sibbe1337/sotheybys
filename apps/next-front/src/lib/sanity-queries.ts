import { sanityClient, queries } from './sanity';

export interface SanityStaffMember {
  _id: string;
  name: string;
  slug: { current: string };
  role: {
    fi?: string;
    sv?: string;
    en?: string;
  };
  email: string;
  phone: string;
  photo: any;
  bio?: {
    fi?: any[];
    sv?: any[];
    en?: any[];
  };
  specialization?: string[];
  order: number;
}

export interface SanityPage {
  _id: string;
  title: string;
  slug: { current: string };
  content?: any[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: any;
  };
  publishedAt?: string;
}

export interface SanityGlobalSettings {
  title?: string;
  description?: string;
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  social?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: any;
    favicon?: any;
  };
  analytics?: {
    googleAnalyticsId?: string;
    googleTagManagerId?: string;
  };
  logo?: any;
  colors?: {
    primary?: { hex?: string };
    secondary?: { hex?: string };
    background?: { hex?: string };
    text?: { hex?: string };
  };
}

export async function getStaffMembers(): Promise<SanityStaffMember[]> {
  try {
    const staff = await sanityClient.fetch(queries.staff);
    return staff || [];
  } catch (error) {
    console.error('Error fetching staff:', error);
    return [];
  }
}

export async function getPageBySlug(slug: string): Promise<SanityPage | null> {
  try {
    const page = await sanityClient.fetch(queries.pageBySlug(slug));
    return page;
  } catch (error) {
    console.error(`Error fetching page ${slug}:`, error);
    return null;
  }
}

export async function getGlobalSettings(): Promise<SanityGlobalSettings | null> {
  try {
    const settings = await sanityClient.fetch(queries.globalSettings);
    return settings;
  } catch (error) {
    console.error('Error fetching global settings:', error);
    return null;
  }
}

