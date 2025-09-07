import { gql } from "@apollo/client";
import { POST_BASIC_FIELDS, FEATURED_IMAGE_FIELDS } from "./fragments-simple";

export const GET_POSTS = gql`
  query GetPosts($first: Int = 10, $after: String) {
    posts(first: $first, after: $after, where: { hasPassword: false, status: PUBLISH }) {
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      nodes {
        ...PostBasicFields
        content
        categories {
          nodes {
            id
            name
            slug
          }
        }
        tags {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
  }
  ${POST_BASIC_FIELDS}
`;

export const GET_PROPERTIES = gql`
  query GetProperties($first: Int = 12, $after: String) {
    posts(first: $first, after: $after, where: { hasPassword: false, status: PUBLISH }) {
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      nodes {
        ...PostBasicFields
        content
        # ACF fields will be added here later when configured
      }
    }
  }
  ${POST_BASIC_FIELDS}
`;

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      ...PostBasicFields
      content
      categories {
        nodes {
          id
          name
          slug
        }
      }
      tags {
        nodes {
          id
          name
          slug
        }
      }
    }
  }
  ${POST_BASIC_FIELDS}
`;

export const GET_PROPERTY_BY_SLUG = gql`
  query GetPropertyBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      ...PostBasicFields
      content
      # ACF fields will be added here later when configured
    }
  }
  ${POST_BASIC_FIELDS}
`;

export const GET_PAGE_BY_SLUG = gql`
  query GetPageBySlug($slug: ID!) {
    page(id: $slug, idType: SLUG) {
      id
      title
      slug
      content
      status
      featuredImage {
        node {
          ...FeaturedImageFields
        }
      }
    }
  }
  ${FEATURED_IMAGE_FIELDS}
`;

export const GET_SITE_SETTINGS = gql`
  query GetSiteSettings {
    generalSettings {
      title
      description
      url
      language
      timezone
    }
  }
`;

export const GET_MENU_ITEMS = gql`
  query GetMenuItems($location: MenuLocationEnum!) {
    menus(where: { location: $location }) {
      nodes {
        name
        slug
        menuItems {
          nodes {
            id
            label
            url
            path
            target
            title
            cssClasses
            description
            parentId
            childItems {
              nodes {
                id
                label
                url
                path
                target
                title
                cssClasses
                description
              }
            }
          }
        }
      }
    }
  }
`; 