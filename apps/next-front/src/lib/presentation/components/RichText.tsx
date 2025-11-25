import DOMPurify from 'isomorphic-dompurify';

interface RichTextProps {
  html: string;
  className?: string;
}

/**
 * Convert plain text with double line breaks to paragraphs
 * Robert 2025-11-25: Fix for Mellstenintie description spacing
 */
function convertToParas(html: string): string {
  // If already has paragraph tags, return as-is
  if (html.includes('<p>') || html.includes('<p ')) {
    return html;
  }
  
  // Split by double line breaks (paragraph separators)
  const paragraphs = html.split(/\n\n+|\r\n\r\n+/);
  
  // If only one paragraph or no line breaks, check for single line breaks
  if (paragraphs.length === 1) {
    // Try splitting by single line breaks as fallback
    const lines = html.split(/\n|\r\n/);
    if (lines.length > 1) {
      return lines
        .filter(line => line.trim())
        .map(line => `<p>${line.trim()}</p>`)
        .join('');
    }
    // No line breaks at all - wrap in single p tag
    return `<p>${html.trim()}</p>`;
  }
  
  // Wrap each paragraph in <p> tags
  return paragraphs
    .filter(p => p.trim())
    .map(p => `<p>${p.trim().replace(/\n/g, '<br/>')}</p>`)
    .join('');
}

/**
 * Safely render HTML content with sanitization
 * Prevents XSS attacks from Linear/WP content
 */
export function RichText({ html, className }: RichTextProps) {
  // First convert plain text to paragraphs if needed
  const withParas = convertToParas(html);
  
  const sanitized = DOMPurify.sanitize(withParas, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}

