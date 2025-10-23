import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a consistent slug from text
 * Handles Finnish characters and ensures consistent slug generation across the app
 */
export function generateSlug(text: string): string {
  if (!text) {
    return '';
  }
  
  return text
    .toLowerCase()
    .replace(/[äå]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Convert YouTube URL to embed format
 * Handles various YouTube URL formats
 */
export function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  
  // Already an embed URL
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  
  // Handle youtu.be format
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }
  
  // Handle youtube.com/watch format
  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }
  
  // Handle youtube.com/v/ format
  const vMatch = url.match(/youtube\.com\/v\/([a-zA-Z0-9_-]+)/);
  if (vMatch) {
    return `https://www.youtube.com/embed/${vMatch[1]}`;
  }
  
  // Return original URL if not a YouTube URL
  return url;
}

/**
 * Check if a URL is a valid YouTube video URL
 */
export function isValidYouTubeUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  
  // Check if it's just the YouTube homepage
  if (url === 'https://www.youtube.com/' || url === 'https://youtube.com/') {
    return false;
  }
  
  // Check for valid YouTube URL patterns
  return (
    url.includes('youtu.be/') ||
    url.includes('youtube.com/watch') ||
    url.includes('youtube.com/v/') ||
    url.includes('youtube.com/embed/')
  );
}

/**
 * Convert Vimeo URL to embed format
 * Handles various Vimeo URL formats
 */
export function getVimeoEmbedUrl(url: string): string {
  if (!url) return '';
  
  // Already an embed URL
  if (url.includes('player.vimeo.com/video/')) {
    return url;
  }
  
  // Handle standard Vimeo URLs: https://vimeo.com/123456789
  const match = url.match(/vimeo\.com\/(\d+)/);
  if (match) {
    return `https://player.vimeo.com/video/${match[1]}?title=0&byline=0&portrait=0`;
  }
  
  return url;
}

/**
 * Check if a URL is a valid Vimeo video URL
 */
export function isValidVimeoUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  return url.includes('vimeo.com/') && !url.endsWith('vimeo.com/') && !url.endsWith('vimeo.com');
}

/**
 * Check if a URL is a valid video URL (YouTube or Vimeo)
 */
export function isValidVideoUrl(url: string | null | undefined): boolean {
  return isValidYouTubeUrl(url) || isValidVimeoUrl(url);
}

/**
 * Get embed URL for any supported video platform
 */
export function getVideoEmbedUrl(url: string): string {
  if (!url) return '';
  if (isValidYouTubeUrl(url)) return getYouTubeEmbedUrl(url);
  if (isValidVimeoUrl(url)) return getVimeoEmbedUrl(url);
  return url;
}

/**
 * Calculate price per square meter
 * Used for displaying €/m² for prices and fees
 * @param value - The value in euros
 * @param area - The area in square meters (livingArea)
 * @returns The value per m² or undefined if calculation not possible
 */
export function perM2(value?: number | null, area?: number | null): number | undefined {
  if (!value || !area || area <= 0) return undefined;
  return value / area;
}

/**
 * Format price per square meter with proper rounding
 * @param value - The value in euros
 * @param area - The area in square meters
 * @returns Formatted string like "1 234 €/m²" or empty string
 */
export function formatPerM2(value?: number | null, area?: number | null): string {
  const perSqm = perM2(value, area);
  if (perSqm === undefined) return '';
  
  // Round to whole number for €/m² display
  const rounded = Math.round(perSqm);
  
  // Format with Finnish number formatting (space as thousands separator)
  return `${rounded.toLocaleString('fi-FI')} €/m²`;
}
