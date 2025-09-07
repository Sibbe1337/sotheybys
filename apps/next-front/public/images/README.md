# Image Directory Structure

This directory contains all the static images used in the Sotheby's International Realty Next.js application.

## Directory Structure

```
/images/
├── backgrounds/      # Background images and patterns
├── content/         # Content images (offices, team photos, etc.)
├── defaults/        # Default/placeholder images
├── icons/          # SVG and icon files
└── logos/          # Logo variations
```

## Usage

### Importing Images

For static images, use Next.js Image component:

```jsx
import Image from 'next/image';

<Image
  src="/images/logos/sothebys-logo-white.svg"
  alt="Sotheby's International Realty"
  width={200}
  height={50}
/>
```

### Using Image Configuration

For dynamic images or placeholders, use the image configuration:

```jsx
import { getImageUrl, getPlaceholderImage } from '@/config/images';

// Get mapped image URL
const imageUrl = getImageUrl(originalUrl);

// Get placeholder
const placeholder = getPlaceholderImage('property');
```

## Image Optimization

All images should be:
- Optimized for web (compressed)
- In modern formats (WebP, AVIF) where possible
- Properly sized for their use cases
- Include appropriate alt text for accessibility

## Legacy Images

Images from the WordPress legacy theme are stored here and mapped through the configuration file at `src/config/images.ts`.
