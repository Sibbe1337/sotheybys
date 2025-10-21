/**
 * PropertyCard Component Contract Tests
 * 
 * Validates PropertyCard behavior per homepage spec & i18n requirements:
 * - Uses LocaleLink for language preservation
 * - Shows price (fi-FI, no cents)
 * - Shows title (no HTML tags)
 * - Shows address with postal code
 * - Shows PropertyTypeChip when available
 * - Shows MetaRow with bedrooms, bathrooms, area (appends " m²")
 * - Shows agent chip when available
 * - Hides empty values
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropertyCard from '@/components/Property/PropertyCard';
import type { Property, Agent } from '@/lib/wordpress';

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

jest.mock('@/components/LocaleLink', () => ({
  LocaleLink: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

jest.mock('@/components/ui/Price', () => ({
  Price: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

jest.mock('@/components/ui/MetaRow', () => ({
  MetaRow: ({ items }: any) => (
    <div data-testid="meta-row">
      {items.filter((item: any) => item.value).map((item: any, i: number) => (
        <span key={i}>{item.value}</span>
      ))}
    </div>
  ),
}));

jest.mock('@/components/ui/Button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

jest.mock('@/components/ui/PropertyTypeChip', () => ({
  PropertyTypeChip: ({ type }: any) => <span data-testid="property-type-chip">{type}</span>,
}));

describe('PropertyCard Component Contract', () => {
  const mockCompleteProperty: Property = {
    address: 'Bernhardinkatu 1',
    city: 'Helsinki',
    location: {
      postCode: '00130',
    },
    price: 1570000,
    bedrooms: 3,
    bathrooms: 2,
    area: 97.21,
    propertyType: 'Kerrostalo',
  };

  const mockAgent: Agent = {
    id: 'agent-1',
    name: 'Matti Meikäläinen',
    phone: '+358 40 123 4567',
    email: 'matti@example.com',
    photo: {
      sourceUrl: '/agent.jpg',
      altText: 'Matti',
    },
  };

  const mockFeaturedImage = {
    node: {
      sourceUrl: '/property.jpg',
      altText: 'Property image',
      mediaDetails: {
        width: 800,
        height: 600,
      },
    },
  };

  describe('Complete Data Rendering', () => {
    it('renders all elements when complete data is provided', () => {
      render(
        <PropertyCard
          id="1"
          title="Upea asunto keskustassa"
          slug="bernhardinkatu-1"
          excerpt="Hieno koti keskeisellä paikalla"
          featuredImage={mockFeaturedImage}
          property={mockCompleteProperty}
          agent={mockAgent}
          language="fi"
        />
      );

      // Check LocaleLink (as <a> in mock)
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/property/bernhardinkatu-1');

      // Check price (fi-FI format, no cents)
      expect(screen.getByText(/1\s?570\s?000\s?€/)).toBeInTheDocument();

      // Check title (no HTML tags)
      expect(screen.getByText('Upea asunto keskustassa')).toBeInTheDocument();

      // Check address with postal code
      expect(screen.getByText(/Bernhardinkatu 1, 00130 Helsinki/)).toBeInTheDocument();

      // Check PropertyTypeChip
      expect(screen.getByTestId('property-type-chip')).toHaveTextContent('Kerrostalo');

      // Check MetaRow (bedrooms, bathrooms, area with m²)
      const metaRow = screen.getByTestId('meta-row');
      expect(metaRow).toHaveTextContent('3 mh'); // Finnish bedrooms
      expect(metaRow).toHaveTextContent('2 kph'); // Finnish bathrooms
      expect(metaRow).toHaveTextContent('97.21 m²'); // Area with m²

      // Check excerpt (no HTML tags)
      expect(screen.getByText('Hieno koti keskeisellä paikalla')).toBeInTheDocument();

      // Check agent chip
      expect(screen.getByText('Matti Meikäläinen')).toBeInTheDocument();
      expect(screen.getByText('+358 40 123 4567')).toBeInTheDocument();

      // Check button with translation
      expect(screen.getByText('Katso kohde')).toBeInTheDocument(); // Finnish "View Property"
    });

    it('appends " m²" to area when missing', () => {
      const propertyWithoutM2: Property = {
        ...mockCompleteProperty,
        area: 85,
      };

      render(
        <PropertyCard
          id="1"
          title="Test"
          slug="test"
          excerpt=""
          property={propertyWithoutM2}
          language="fi"
        />
      );

      const metaRow = screen.getByTestId('meta-row');
      expect(metaRow).toHaveTextContent('85 m²');
    });

    it('does not append " m²" if already present', () => {
      const propertyWithM2: Property = {
        ...mockCompleteProperty,
        area: '85 m²' as any,
      };

      render(
        <PropertyCard
          id="1"
          title="Test"
          slug="test"
          excerpt=""
          property={propertyWithM2}
          language="fi"
        />
      );

      const metaRow = screen.getByTestId('meta-row');
      // Should appear once, not "85 m² m²"
      expect(metaRow.textContent?.match(/m²/g)?.length).toBe(1);
    });
  });

  describe('Missing Data Handling', () => {
    it('renders city without postal code when postal code is missing', () => {
      const propertyWithoutPostCode: Property = {
        ...mockCompleteProperty,
        location: undefined,
      };

      render(
        <PropertyCard
          id="1"
          title="Test Property"
          slug="test"
          excerpt=""
          property={propertyWithoutPostCode}
          language="fi"
        />
      );

      // Should show "Address, City" without postal code
      expect(screen.getByText(/Bernhardinkatu 1, Helsinki/)).toBeInTheDocument();
      expect(screen.queryByText(/00130/)).not.toBeInTheDocument();
    });

    it('does not render excerpt when empty', () => {
      render(
        <PropertyCard
          id="1"
          title="Test Property"
          slug="test"
          excerpt=""
          property={mockCompleteProperty}
          language="fi"
        />
      );

      // Excerpt paragraph should not exist
      const excerptElement = screen.queryByText(/Hieno koti/);
      expect(excerptElement).not.toBeInTheDocument();
    });

    it('strips HTML tags from excerpt', () => {
      render(
        <PropertyCard
          id="1"
          title="Test Property"
          slug="test"
          excerpt="<p>Text with <strong>HTML</strong> tags</p>"
          property={mockCompleteProperty}
          language="fi"
        />
      );

      // Should show text without HTML tags
      expect(screen.getByText('Text with HTML tags')).toBeInTheDocument();
      // Should not contain raw HTML
      expect(screen.queryByText(/<p>/)).not.toBeInTheDocument();
    });

    it('does not render price when undefined', () => {
      const propertyWithoutPrice: Property = {
        ...mockCompleteProperty,
        price: undefined,
      };

      render(
        <PropertyCard
          id="1"
          title="Test Property"
          slug="test"
          excerpt=""
          property={propertyWithoutPrice}
          language="fi"
        />
      );

      // Price should not be rendered
      const priceElement = screen.queryByText(/€/);
      expect(priceElement).not.toBeInTheDocument();
    });

    it('does not render PropertyTypeChip when propertyType is missing', () => {
      const propertyWithoutType: Property = {
        ...mockCompleteProperty,
        propertyType: undefined,
      };

      render(
        <PropertyCard
          id="1"
          title="Test Property"
          slug="test"
          excerpt=""
          property={propertyWithoutType}
          language="fi"
        />
      );

      expect(screen.queryByTestId('property-type-chip')).not.toBeInTheDocument();
    });

    it('hides empty meta values (no placeholder "0")', () => {
      const propertyWithZeros: Property = {
        ...mockCompleteProperty,
        bedrooms: 0,
        bathrooms: undefined,
        area: 0,
      };

      render(
        <PropertyCard
          id="1"
          title="Test Property"
          slug="test"
          excerpt=""
          property={propertyWithZeros}
          language="fi"
        />
      );

      const metaRow = screen.getByTestId('meta-row');
      // Should not show "0 mh" or "0 kph"
      expect(metaRow).not.toHaveTextContent('0');
      // Meta row should be essentially empty
      expect(metaRow.textContent?.trim()).toBe('');
    });

    it('does not render agent section when agent is missing', () => {
      render(
        <PropertyCard
          id="1"
          title="Test Property"
          slug="test"
          excerpt=""
          property={mockCompleteProperty}
          language="fi"
        />
      );

      expect(screen.queryByText('Matti Meikäläinen')).not.toBeInTheDocument();
    });

    it('does not render agent phone when missing', () => {
      const agentWithoutPhone: Agent = {
        ...mockAgent,
        phone: undefined,
      };

      render(
        <PropertyCard
          id="1"
          title="Test Property"
          slug="test"
          excerpt=""
          property={mockCompleteProperty}
          agent={agentWithoutPhone}
          language="fi"
        />
      );

      expect(screen.getByText('Matti Meikäläinen')).toBeInTheDocument();
      expect(screen.queryByText(/\+358/)).not.toBeInTheDocument();
    });
  });

  describe('Internationalization', () => {
    it('uses Swedish translations when language is "sv"', () => {
      render(
        <PropertyCard
          id="1"
          title="Test Property"
          slug="test"
          excerpt=""
          property={mockCompleteProperty}
          language="sv"
        />
      );

      const metaRow = screen.getByTestId('meta-row');
      expect(metaRow).toHaveTextContent('sr'); // Swedish bedrooms
      expect(metaRow).toHaveTextContent('br'); // Swedish bathrooms

      expect(screen.getByText('Se objekt')).toBeInTheDocument(); // Swedish "View Property"
    });

    it('uses English translations when language is "en"', () => {
      render(
        <PropertyCard
          id="1"
          title="Test Property"
          slug="test"
          excerpt=""
          property={mockCompleteProperty}
          language="en"
        />
      );

      const metaRow = screen.getByTestId('meta-row');
      expect(metaRow).toHaveTextContent('br'); // English bedrooms
      expect(metaRow).toHaveTextContent('ba'); // English bathrooms

      expect(screen.getByText('View Property')).toBeInTheDocument(); // English
    });

    it('defaults to Finnish when language is not specified', () => {
      render(
        <PropertyCard
          id="1"
          title="Test Property"
          slug="test"
          excerpt=""
          property={mockCompleteProperty}
        />
      );

      expect(screen.getByText('Katso kohde')).toBeInTheDocument(); // Finnish
    });
  });

  describe('Price Formatting', () => {
    it('formats price in fi-FI locale without cents', () => {
      render(
        <PropertyCard
          id="1"
          title="Test Property"
          slug="test"
          excerpt=""
          property={{ ...mockCompleteProperty, price: 1234567 }}
          language="fi"
        />
      );

      // fi-FI formats as "1 234 567 €" (with non-breaking spaces)
      expect(screen.getByText(/1\s?234\s?567\s?€/)).toBeInTheDocument();
    });

    it('formats price without decimal places', () => {
      render(
        <PropertyCard
          id="1"
          title="Test Property"
          slug="test"
          excerpt=""
          property={{ ...mockCompleteProperty, price: 500000.99 }}
          language="fi"
        />
      );

      // Should show 500 000 €, not 500 000,99 €
      expect(screen.getByText(/500\s?000\s?€/)).toBeInTheDocument();
      expect(screen.queryByText(/,99/)).not.toBeInTheDocument();
    });
  });
});

