import axios from 'axios';

const API_KEY = '39056090-468b50e5b7a7c6b8cc1db5a29';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages(searchQuery, page) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40,
      },
    });
    return response.data.hits;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
}
