const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
function readPreference(key) { try { return localStorage.getItem(key); } catch { return null; } }
function savePreference(key, value) { try { localStorage.setItem(key, value); } catch {} }
function setTheme(theme) {
  root.dataset.theme = theme;
  themeToggle.querySelector('.theme-icon').textContent = theme === 'light' ? '☀' : '☾';
  savePreference('theme', theme);
}
const storedTheme = readPreference('theme');
setTheme(['light','dark'].includes(storedTheme) ? storedTheme : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
themeToggle.addEventListener('click', () => setTheme(root.dataset.theme === 'light' ? 'dark' : 'light'));
function setLanguage(language) {
  const lang = language === 'en' ? 'en' : 'tr';
  root.lang = lang;
  document.querySelectorAll('[data-tr][data-en]').forEach(el => { el.textContent = el.dataset[lang]; });
  document.querySelectorAll('[data-aria-tr]').forEach(el => { el.setAttribute('aria-label', lang === 'en' ? el.dataset.ariaEn : el.dataset.ariaTr); });
  document.querySelectorAll('[data-language]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.language === lang)));
  const title = 'Metehan Güney | ' + (lang === 'en' ? 'System Administrator' : 'Sistem Uzmanı');
  const description = lang === 'en' ? 'Metehan Güney — System Administrator. Windows Server, Active Directory, virtualization, Microsoft 365 and PowerShell automation.' : 'Metehan Güney — Sistem Uzmanı. Windows Server, Active Directory, sanallaştırma, Microsoft 365 ve PowerShell otomasyonu.';
  document.title = title;
  document.querySelector('meta[name="description"]').content = description;
  document.querySelector('meta[property="og:title"]').content = title;
  document.querySelector('meta[property="og:description"]').content = description;
  document.querySelector('meta[name="twitter:title"]').content = title;
  document.querySelector('meta[name="twitter:description"]').content = description;
  document.querySelector('meta[property="og:locale"]').content = lang === 'en' ? 'en_US' : 'tr_TR';
  savePreference('language', lang);
}
setLanguage(readPreference('language'));
document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
document.getElementById('year').textContent = new Date().getFullYear();
let toastTimer;
document.querySelector('.copy-mail').addEventListener('click', async event => {
  const email = event.currentTarget.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
  } catch { window.location.href = 'mailto:' + email; }
});
