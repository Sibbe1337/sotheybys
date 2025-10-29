import DOMPurify from 'isomorphic-dompurify';

interface RichTextProps {
  html: string;
  className?: string;
}

/**
 * Safely render HTML content with sanitization
 * Prevents XSS attacks from Linear/WP content
 */
export function RichText({ html, className }: RichTextProps) {
  const sanitized = DOMPurify.sanitize(html, {
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

