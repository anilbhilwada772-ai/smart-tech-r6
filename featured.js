
import { supabase } from './supabase.js';

// Adds Featured Photos and Trending Blogs above the main gallery.
const mainGallery = document.getElementById('dynamicGallery');
const anchor = mainGallery?.parentElement || document.querySelector('main') || document.body;

const featuredStyle = document.createElement('style');
featuredStyle.textContent = `
  .featured-section { max-width:1100px; margin:28px auto; padding:0 16px; }
  .featured-section h2 { margin-bottom:14px; }
  .featured-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:16px; }
  .featured-card { background:#fff; padding:12px; border-radius:13px; box-shadow:0 4px 15px rgba(30,80,140,.12); }

  .featured-card img {
    width:100%;
    aspect-ratio:16 / 9;
    height:auto;
    object-fit:contain;
    display:block;
    border-radius:9px;
  }

  .featured-card a { color:#1769e0; font-weight:bold; }
  .featured-tag { display:inline-block; color:#1769e0; background:#eaf2ff; border-radius:20px; padding:4px 8px; font-size:12px; margin:6px 0; }
`;
document.head.appendChild(featuredStyle);

const photosSection = document.createElement('section');
photosSection.className = 'featured-section';
photosSection.innerHTML = '<h2>⭐ Featured AI Photos</h2><div class="featured-grid" id="featuredPhotos">Loading...</div>';

const blogsSection = document.createElement('section');
blogsSection.className = 'featured-section';
blogsSection.innerHTML = '<h2>🔥 Trending Blogs</h2><div class="featured-grid" id="trendingBlogs">Loading...</div>';

if (mainGallery) {
  mainGallery.parentElement.insertBefore(photosSection, mainGallery);
  mainGallery.parentElement.insertBefore(blogsSection, mainGallery);
} else {
  anchor.prepend(blogsSection);
  anchor.prepend(photosSection);
}

const photoGrid = document.getElementById('featuredPhotos');
const blogGrid = document.getElementById('trendingBlogs');

function showEmpty(target, text) {
  target.textContent = text;
}

const [{ data: photos, error: photoError }, { data: blogs, error: blogError }] = await Promise.all([
  supabase.from('ai_prompts').select('id,title,image_url,category,is_featured').eq('is_featured', true).order('created_at', { ascending: false }).limit(6),
  supabase.from('blog_posts').select('id,title,description,image_url,category,is_featured').eq('is_featured', true).order('created_at', { ascending: false }).limit(6)
]);

if (photoError) {
  showEmpty(photoGrid, 'Featured photos could not be loaded.');
} else if (!photos?.length) {
  showEmpty(photoGrid, 'No featured photos yet.');
} else {
  photoGrid.innerHTML = '';
  photos.forEach(item => {
    const card = document.createElement('article');
    card.className = 'featured-card';
    const img = document.createElement('img');
    img.src = item.image_url;
    img.alt = item.title;
    const title = document.createElement('h3');
    title.textContent = item.title;
    const tag = document.createElement('span');
    tag.className = 'featured-tag';
    tag.textContent = item.category || 'AI Photo';
    const link = document.createElement('a');
    link.href = `prompt-detail.html?id=${encodeURIComponent(item.id)}`;
    link.textContent = 'View Prompt';
    card.append(img, title, tag, link);
    photoGrid.appendChild(card);
  });
}

if (blogError) {
  showEmpty(blogGrid, 'Trending blogs could not be loaded.');
} else if (!blogs?.length) {
  showEmpty(blogGrid, 'No trending blogs yet.');
} else {
  blogGrid.innerHTML = '';
  blogs.forEach(item => {
    const card = document.createElement('article');
    card.className = 'featured-card';
    if (item.image_url) {
      const img = document.createElement('img');
      img.src = item.image_url;
      img.alt = item.title;
      card.appendChild(img);
    }
    const title = document.createElement('h3');
    title.textContent = item.title;
    const description = document.createElement('p');
    description.textContent = item.description || '';
    const tag = document.createElement('span');
    tag.className = 'featured-tag';
    tag.textContent = item.category || 'Blog';
    const link = document.createElement('a');
    link.href = `blog-detail.html?id=${encodeURIComponent(item.id)}`;
    link.textContent = 'Read More';
    card.append(title, description, tag, link);
    blogGrid.appendChild(card);
  });
}
