'use client';

interface ClientGoogleMapProps {
  src: string;
  title?: string;
  className?: string;
}

export default function ClientGoogleMap({ src, title = 'Google Maps', className = '' }: ClientGoogleMapProps) {
  return (
    <iframe
      src={src}
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={className}
      title={title}
    />
  );
}

