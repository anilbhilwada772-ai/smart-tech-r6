
import { supabase } from './supabase.js';

const gallery = document.getElementById('dynamicGallery');

async function loadPrompts() {
  if (!gallery) return;

  gallery.textContent = 'Loading AI Photos...';

  const { data, error } = await supabase
    .from('ai_prompts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    gallery.textContent = 'Photos load nahi ho paaye.';
    console.error(error);
    return;
  }

  gallery.innerHTML = '';

  if (!data || data.length === 0) {
    gallery.textContent = 'No AI Photos uploaded yet.';
    return;
  }

  data.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'prompt-card';

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

loadPrompts();
