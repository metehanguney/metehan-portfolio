const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const savedTheme = localStorage.getItem('theme');

function setTheme(theme) {
  root.dataset.theme = theme;
  themeIcon.textContent = theme === 'light' ? '☀' : '☾';
  localStorage.setItem('theme', theme);
}

if (savedTheme) setTheme(savedTheme);
else if (window.matchMedia('(prefers-color-scheme: light)').matches) setTheme('light');
else setTheme('dark');

themeToggle.addEventListener('click', () => {
  setTheme(root.dataset.theme === 'light' ? 'dark' : 'light');
});

document.getElementById('year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const toast = document.getElementById('toast');
document.querySelector('.copy-mail').addEventListener('click', async (event) => {
  try {
    await navigator.clipboard.writeText(event.currentTarget.dataset.email);
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1800);
  } catch {
    window.location.href = `mailto:${event.currentTarget.dataset.email}`;
  }
});


// Project image lightbox
const lightbox = document.getElementById('imageLightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
  setTimeout(() => { lightboxImage.src = ''; }, 220);
}

if (lightbox && lightboxImage && lightboxCaption && lightboxClose) {
  document.querySelectorAll('.project-visual img').forEach((img) => {
  img.setAttribute('tabindex', '0');
  img.setAttribute('role', 'button');
  img.setAttribute('aria-label', `${img.alt} - büyütmek için aç`);
  const open = () => {
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightboxCaption.textContent = img.alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    lightboxClose.focus();
  };
  img.addEventListener('click', open);
  img.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
  });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox(); });
}

// Disable right-click context menu across the site
document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});
