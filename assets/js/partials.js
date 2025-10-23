async function includePartials() {
  const parts = document.querySelectorAll('[data-include]');
  await Promise.all([...parts].map(async el => {
    const file = el.getAttribute('data-include');
    try {
      const res = await fetch(`/partials/${file}.html`);
      el.innerHTML = await res.text();
    } catch (err) {
      console.error(`Failed to load ${file}`, err);
    }
  }));
  
  // Initialize nav after loading
  initNav();
}

function initNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('active');
    });
  }
}

document.addEventListener('DOMContentLoaded', includePartials);

export { includePartials };
