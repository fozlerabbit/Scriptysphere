const API_URL = 'https://script.google.com/macros/s/AKfycbwphz5L1804nvRdM2S_p-t_gglZ3z7ruLCgXwicwGMhQOZg6mCs7kEDSwTVrULN2G_M/exec';

// Configuration
const DEFAULT_PHOTO = 'https://raw.githubusercontent.com/sinan544/profile/refs/heads/main/logo.png';
let membersData = [];

// DOM Elements
const dom = {
  searchInput: document.getElementById('searchInput'),
  skillFilter: document.getElementById('skillFilter'),
  cardSection: document.getElementById('cardSection'),
  messageContainer: document.getElementById('messageContainer'),
  loader: document.getElementById('loader')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  try {
    showLoading(true);
    await loadMembers();
    setupEventListeners();
  } catch (error) {
    showError(`Initialization failed: ${error.message}`);
  } finally {
    showLoading(false);
  }
});

// Core Functions
async function loadMembers() {
  try {
    const response = await fetch(API_URL);
    validateResponse(response);
    const json = await response.json();
    membersData = json.data || []; // ✅ FIXED: extract array properly
    renderCards(membersData);
    populateSkillFilter();
  } catch (error) {
    throw new Error(`Failed to load members: ${error.message}`);
  }
}

function renderCards(members) {
  dom.cardSection.innerHTML = members.map(member => createCardHTML(member)).join('');
  initCardInteractions();
}

function createCardHTML(member) {
  const emailPrefix = member.email?.split('@')[0].toUpperCase() || 'SSM';
  const facebookUrl = member.facebook?.startsWith('http') ? member.facebook : `https://facebook.com/${member.facebook}`;

  return `
    <div class="card-container">
      <div class="card-inner">
        <div class="card-front">
          <img src="${optimizeImageUrl(member.photo)}" 
               class="profile-img" 
               alt="${member.name}"
               loading="lazy"
               onerror="this.src='${DEFAULT_PHOTO}'">
          <h2 style="text-align:center;">${member.name}</h2>
          <p class="role" style="text-align:center;">${member.skill || 'No Skill Listed'}</p>
          <p class="member-id">${emailPrefix}</p>
        </div>
        <div class="card-back">
          <div class="bio">
            <h3>About Me</h3>
            <p>${member.about || 'No bio available'}</p>
          </div>
          <div class="contact-info">
            ${member.phone ? `<p><i class="fas fa-phone"></i> ${formatBangladeshiPhone(member.phone)}</p>` : ''}
            ${member.email ? `<p><i class="fas fa-envelope"></i> ${member.email}</p>` : ''}
          </div>
          <div class="social-links">
            ${member.facebook ? `
              <a href="${facebookUrl}" class="social-link" target="_blank" rel="noopener">
                <i class="fab fa-facebook"></i>
              </a>` : ''}
            ${member.email ? `
              <a href="mailto:${member.email}" class="social-link">
                <i class="fas fa-envelope"></i>
              </a>` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

// Bangladeshi Phone Number Formatter
function formatBangladeshiPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('880') && cleaned.length === 13) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 9)} ${cleaned.slice(9)}`;
  }
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    const intlFormat = `880${cleaned.slice(1)}`;
    return `+${intlFormat.slice(0, 3)} ${intlFormat.slice(3, 5)} ${intlFormat.slice(5, 9)} ${intlFormat.slice(9)}`;
  }
  return phone;
}

// Image Optimizer
function optimizeImageUrl(url) {
  if (!url.includes('google.com')) return url;
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=300&h=300&fit=cover`;
}

// Flip Interaction
function initCardInteractions() {
  document.querySelectorAll('.card-container').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('a')) card.classList.toggle('flipped');
    });
  });
}

// Event Setup
function setupEventListeners() {
  dom.searchInput.addEventListener('input', debounce(() => filterCards(), 300));
  dom.skillFilter.addEventListener('change', () => filterCards());
}

// Populate Dropdown Filter
function populateSkillFilter() {
  const skills = [...new Set(membersData.flatMap(m =>
    m.skill?.split(',').map(s => s.trim()).filter(Boolean)
  ))].sort();

  dom.skillFilter.innerHTML = `
    <option value="">All Skills</option>
    ${skills.map(skill => `<option value="${skill.toLowerCase()}">${skill}</option>`).join('')}
  `;
}

// Filtering Cards
function filterCards() {
  const searchTerm = dom.searchInput.value.toLowerCase();
  const selectedSkill = dom.skillFilter.value.toLowerCase();

  const filtered = membersData.filter(member => {
    const nameMatch = member.name?.toLowerCase().includes(searchTerm);
    const emailMatch = member.email?.toLowerCase().includes(searchTerm);
    const skillMatch = !selectedSkill || member.skill?.toLowerCase().includes(selectedSkill);
    return (nameMatch || emailMatch) && skillMatch;
  });

  renderCards(filtered);
  dom.messageContainer.textContent = filtered.length ? '' : 'No matching members found';
}

// Utility Functions
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), timeout);
  };
}

function validateResponse(response) {
  if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    throw new Error('Invalid API response format');
  }
}

function showLoading(show) {
  if (dom.loader) {
    dom.loader.style.display = show ? 'block' : 'none';
  }
}

function showError(message) {
  dom.messageContainer.innerHTML = `
    <div class="error-message">
      <p>${message}</p>
      <button onclick="window.location.reload()">Retry</button>
    </div>
  `;
}
