/**
 * Date Formatter
 * 
 * Per spec: "format with toLocaleDateString(locale); accept both dd.MM.yyyy and ISO yyyy-MM-dd"
 */

import type { Locale } from '@/lib/domain/property.types';

/**
 * Format date string to localized date
 * Accepts:
 * - dd.MM.yyyy (Finnish format)
 * - yyyy-MM-dd (ISO format)
 * - Date object
 */
export function formatDate(dateInput: string | Date | undefined, locale: Locale): string {
  if (!dateInput) return '';
  
  try {
    let date: Date;
    
    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === 'string') {
      // Try to parse different formats
      const trimmed = dateInput.trim();
      
      // Check if it's dd.MM.yyyy format
      if (/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(trimmed)) {
        const [day, month, year] = trimmed.split('.');
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
      // Check if it's ISO format (yyyy-MM-dd or yyyy-MM-ddTHH:mm:ss)
      else if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
        date = new Date(trimmed);
      }
      // Try generic Date constructor
      else {
        date = new Date(trimmed);
      }
    } else {
      return '';
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateInput.toString(); // Return original if parsing failed
    }
    
    // Format based on locale
    const localeStr = locale === 'sv' ? 'sv-SE' : locale === 'en' ? 'en-GB' : 'fi-FI';
    
    return date.toLocaleDateString(localeStr, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    console.warn('Date formatting error:', error);
    return typeof dateInput === 'string' ? dateInput : '';
  }
}

/**
 * Format date to long format (e.g., "4. toukokuuta 2025")
 */
export function formatDateLong(dateInput: string | Date | undefined, locale: Locale): string {
  if (!dateInput) return '';
  
  try {
    let date: Date;
    
    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === 'string') {
      const trimmed = dateInput.trim();
      
      if (/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(trimmed)) {
        const [day, month, year] = trimmed.split('.');
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
        date = new Date(trimmed);
      } else {
        date = new Date(trimmed);
      }
    } else {
      return '';
    }
    
    if (isNaN(date.getTime())) {
      return dateInput.toString();
    }
    
    const localeStr = locale === 'sv' ? 'sv-SE' : locale === 'en' ? 'en-GB' : 'fi-FI';
    
    return date.toLocaleDateString(localeStr, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.warn('Date formatting error:', error);
    return typeof dateInput === 'string' ? dateInput : '';
  }
}
