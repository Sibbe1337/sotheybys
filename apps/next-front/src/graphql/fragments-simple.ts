import { gql } from "@apollo/client";

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

// Simplified versions without ACF fields for now
export const PROPERTY_FIELDS_BASIC = gql`
  fragment PropertyFieldsBasic on Post {
    # Basic post fields only - ACF fields will be added later
    id
    title
    slug
    excerpt
    content
  }
`;

export const AGENT_FIELDS_BASIC = gql`
  fragment AgentFieldsBasic on Post {
    # Basic post fields only - ACF fields will be added later
    id
    title
    slug
    excerpt
  }
`; 