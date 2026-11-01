
import { supabase } from './supabase.js';

const gallery = document.getElementById('dynamicGallery');
const categoryButtons = document.querySelectorAll('.category-btn');

let allPrompts = [];

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

function showPrompts(selectedCategory) {
  if (!gallery) return;

  // पुराने Static Photo Cards को भी Filter में शामिल करें
  const oldCards = gallery.querySelectorAll('.photo-card');

  oldCards.forEach((card) => {
    const category = card.dataset.category || 'Other';
    card.style.display =
      selectedCategory === 'All' || category === selectedCategory
        ? ''
        : 'none';
  });

  // पहले से मौजूद Dynamic Cards हटाएँ
  gallery.querySelectorAll('.prompt-card').forEach(card => card.remove());

  const filteredPrompts = selectedCategory === 'All'
    ? allPrompts
    : allPrompts.filter(item => (item.category || 'Other') === selectedCategory);

  filteredPrompts.forEach((item) => {
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
}

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const category = button.dataset.category;
    showPrompts(category);
  });
});

loadPrompts();
