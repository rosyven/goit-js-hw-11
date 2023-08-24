import axios from 'axios';
import Notiflix from 'notiflix';

const form = document.querySelector('#search-form');
const btn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');
const API_KEY = '39038614-58edd7163b037e81b257e6c14';
const BASE_URL = 'https://pixabay.com/api/';
let page = 1;
let searchQuery = '';

async function fetchImages() {
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
    const images = response.data.hits;

    if (images.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      btn.style.display = 'none';
      return;
    }

    images.forEach(image => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${image.likes}</p>
          <p class="info-item"><b>Views:</b> ${image.views}</p>
          <p class="info-item"><b>Comments:</b> ${image.comments}</p>
          <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
        </div>
      `;
      gallery.appendChild(card);
    });
    if (page * 40 >= response.data.totalHits) {
      btn.style.display = 'none';
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.error('Error:', error);
    btn.style.display = 'none';
  }
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  page = 1;
  searchQuery = event.target.searchQuery.value.trim();

  if (!searchQuery) {
    Notiflix.Notify.failure('Please enter a valid search query.');
    return;
  }
  btn.style.display = 'none';

  gallery.innerHTML = '';
  await fetchImages();
  btn.style.display = 'block';
});

btn.addEventListener('click', async () => {
  page += 1;
  await fetchImages();
});
