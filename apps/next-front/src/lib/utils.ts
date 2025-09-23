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
