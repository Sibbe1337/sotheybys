import { gql } from "@apollo/client";

export const AGENT_FIELDS = gql`
  fragment AgentFields on Post_Agent {
    name
    phone
    email
    bio
    photo {
      sourceUrl
      altText
      mediaDetails {
        width
        height
      }
    }
  }
`;

export const PROPERTY_FIELDS = gql`
  fragment PropertyFields on Post_Property {
    price
    address
    city
    bedrooms
    bathrooms
    area
    location {
      latitude
      longitude
      streetAddress
      city
      state
      postCode
      country
    }
    gallery {
      sourceUrl
      altText
      mediaDetails {
        width
        height
      }
    }
  }
`;

export const FEATURED_IMAGE_FIELDS = gql`
  fragment FeaturedImageFields on MediaItem {
    sourceUrl
    altText
    mediaDetails {
      width
      height
    }
  }
`;

export const POST_BASIC_FIELDS = gql`
  fragment PostBasicFields on Post {
    id
    title
    slug
    excerpt
    date
    modified
    status
    featuredImage {
      node {
        ...FeaturedImageFields
      }
    }
  }
  ${FEATURED_IMAGE_FIELDS}
`; 