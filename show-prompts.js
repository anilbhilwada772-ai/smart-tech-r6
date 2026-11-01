
import { supabase } from './supabase.js';

const gallery = document.getElementById('dynamicGallery');
const categoryButtons = document.querySelectorAll('.category-btn');
const loadMoreBtn = document.getElementById('loadMoreBtn');

let allPrompts = [];
let selectedCategory = 'All';
let visibleCount = 6;

const PHOTOS_PER_PAGE = 6;

async function loadPrompts() {
  if (!gallery) return;

  const { data, error } = await supabase
    .from('ai_prompts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  allPrompts = data || [];
  showPrompts('All');
}

function showPrompts(category) {
  if (!gallery) return;

  selectedCategory = category;
  visibleCount = 6;

  const oldCards = gallery.querySelectorAll('.photo-card');

  oldCards.forEach((card) => {
    const cardCategory = card.dataset.category || 'Other';
    card.style.display =
      category === 'All' || category === cardCategory ? '' : 'none';
  });

  renderPrompts();
}

function renderPrompts() {
  gallery.querySelectorAll('.prompt-card').forEach(card => card.remove());

  const filteredPrompts = selectedCategory === 'All'
    ? allPrompts
    : allPrompts.filter(
        item => (item.category || 'Other') === selectedCategory
      );

  const visiblePrompts = filteredPrompts.slice(0, visibleCount);

  visiblePrompts.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'prompt-card';
    card.dataset.category = item.category || 'Other';

    const image = document.createElement('img');
    image.src = item.image_url;
    image.alt = item.title;

    const heading = document.createElement('h3');
    heading.textContent = item.title;

    const link = document.createElement('a');
    link.href = `prompt-detail.html?id=${encodeURIComponent(item.id)}`;
    link.textContent = 'View Prompt';

    card.append(image, heading, link);
    gallery.appendChild(card);
  });

  if (loadMoreBtn) {
    loadMoreBtn.style.display =
      visibleCount < filteredPrompts.length ? 'inline-block' : 'none';
  }
}

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    showPrompts(button.dataset.category);
  });
});

if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    visibleCount += PHOTOS_PER_PAGE;
    renderPrompts();
  });
}

loadPrompts();
