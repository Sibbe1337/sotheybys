interface RichTextProps {
  html: string;
  className?: string;
}

/**
 * Remove unwanted headings like "Kuvaus", "Beskrivning", "Description"
 * These are often embedded in API content but should not be displayed
 */
function removeUnwantedHeadings(html: string): string {
  // Remove standalone "Kuvaus", "Beskrivning", "Description" headings
  const headingPatterns = [
    /<h[1-6][^>]*>\s*Kuvaus\s*<\/h[1-6]>/gi,
    /<h[1-6][^>]*>\s*Beskrivning\s*<\/h[1-6]>/gi,
    /<h[1-6][^>]*>\s*Description\s*<\/h[1-6]>/gi,
    /<strong>\s*Kuvaus\s*<\/strong>/gi,
    /<b>\s*Kuvaus\s*<\/b>/gi,
  ];
  
  let cleaned = html;
  for (const pattern of headingPatterns) {
    cleaned = cleaned.replace(pattern, '');
  }
  
  return cleaned;
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
  // Remove unwanted headings first
  const withoutHeadings = removeUnwantedHeadings(html);
  
  // Then convert plain text to paragraphs if needed
  const withParas = convertToParas(withoutHeadings);
  
  // Simple HTML sanitizer - allow only safe tags (no external dependency needed)
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'];
  const allowedAttrs = ['href', 'target', 'rel'];
  
  // Strip all tags except allowed ones
  const sanitized = withParas.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/gi, (match, tag) => {
    const tagLower = tag.toLowerCase();
    if (!allowedTags.includes(tagLower)) return '';
    // For opening tags, strip disallowed attributes
    if (!match.startsWith('</')) {
      const cleanAttrs = allowedAttrs
        .map(attr => {
          const attrMatch = match.match(new RegExp(`${attr}\\s*=\\s*"([^"]*)"`, 'i'));
          return attrMatch ? `${attr}="${attrMatch[1]}"` : null;
        })
        .filter(Boolean)
        .join(' ');
      return cleanAttrs ? `<${tagLower} ${cleanAttrs}>` : `<${tagLower}>`;
    }
    return `</${tagLower}>`;
  });

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}

