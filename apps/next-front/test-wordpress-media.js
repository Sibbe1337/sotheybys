const fetch = require('node-fetch');

async function testWordPressMedia() {
  try {
    const response = await fetch('https://sothebysrealty.fi/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetMediaItems {
            mediaItems(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
              nodes {
                id
                title
                sourceUrl
                altText
                caption
                mediaType
                mediaDetails {
                  width
                  height
                }
              }
            }
          }
        `
      })
    });

    const data = await response.json();
    console.log('Media Items:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testWordPressMedia();
