import Notiflix from 'notiflix';
import { fetchImages } from './pixabay-api';

const form = document.querySelector('#search-form');
const btn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

let page = 1;
let searchQuery = '';
let totalHits = 500;
const PER_PAGE = 40;

function calculateTotalPages(totalHits) {
  return Math.ceil(totalHits / PER_PAGE);
}

function updateLoadMoreButton(images) {
  const totalPages = calculateTotalPages(totalHits);

  if (page >= totalPages || images.length === 0 || images.length < PER_PAGE) {
    btn.style.display = 'none';
    if (!images || images.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } else {
    btn.style.display = 'block';
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
  const images = await loadImages(searchQuery, page);
  updateLoadMoreButton(images);
});

btn.addEventListener('click', async () => {
  page += 1;
  const images = await loadImages(searchQuery, page);
  updateLoadMoreButton(images);
});

async function loadImages(query, page) {
  try {
    const images = await fetchImages(query, page);

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

    return images;
  } catch (error) {
    console.error('Error:', error);
    btn.style.display = 'none';
  }
}
