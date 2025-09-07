import { gql } from '@apollo/client';

// Query to get homepage slider and content
export const GET_HOMEPAGE_DATA = gql`
  query GetHomepageData {
    # Get the homepage by slug
    page(id: "/", idType: URI) {
      title
      content
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
      # ACF fields for homepage if any
      acf {
        heroSlider {
          slide {
            image {
              sourceUrl
              altText
              mediaDetails {
                width
                height
              }
            }
            title
            subtitle
            buttonText
            buttonLink
          }
        }
      }
    }
    
    # Get recent properties
    posts(first: 12, where: { categoryName: "property", status: PUBLISH }) {
      nodes {
        id
        title
        slug
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        acfRealEstate {
          property {
            price
            address
            city
            bedrooms
            bathrooms
            area
            propertyType
            status
          }
          agent {
            name
            email
            phone
            image {
              sourceUrl
              altText
            }
          }
        }
      }
    }
    
    # Get media items for slider
    mediaItems(first: 10, where: { title: "slider" }) {
      nodes {
        id
        sourceUrl
        altText
        caption
        description
        mediaDetails {
          width
          height
        }
      }
    }
  }
`;

// Query to get all pages for replicating structure
export const GET_ALL_PAGES = gql`
  query GetAllPages {
    pages(first: 100, where: { status: PUBLISH }) {
      nodes {
        id
        title
        slug
        uri
        content
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        parent {
          node {
            id
            slug
          }
        }
      }
    }
  }
`;

// Get specific menus
export const GET_HEADER_MENU = gql`
  query GetHeaderMenu {
    menus(where: { location: PRIMARY }) {
      nodes {
        name
        menuItems(first: 100) {
          nodes {
            id
            label
            url
            path
            target
            cssClasses
            parentId
            childItems {
              nodes {
                id
                label
                url
                path
                target
                cssClasses
              }
            }
          }
        }
      }
    }
  }
`;
