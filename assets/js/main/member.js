const API_URL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLj_CXB-U_nlQB2Lq5ZNRD1X75ngLH_SE7LcsEaz6b0femi_0glUWRqokNue_iKmgci0ILDEgO9BUY3Ftz6KqxLhb1XYT2uuTAPdOcM9Gymz6m9oCaTQk9d9Wj6RAt77_-4SoNUne2WG-f2iXrDSo4shfwR6Oyl5aml-yaWtnivuASKSEHqGiCgNcRY4hWZXC8L0eNeCWOFirL3Uy8i0GyH2qd7KenX9Kqg04jfgV6lp1OPfd9d-ePV6MZG3pKi5OT2mWz_RmDbKobdDnx8hgKpX_IiHhg&lib=MddHsRbk_0E1-tyaBozepfl_55EKapUNo';

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
    membersData = await response.json();
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
          <p class="role" style="text-align:center;">${member.skills}</p>
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
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check for valid Bangladeshi numbers
  if (cleaned.startsWith('880') && cleaned.length === 13) {
    // Format: +880 XX XXXX XXXX
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 9)} ${cleaned.slice(9)}`;
  }
  
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    // Convert local format to international
    const intlFormat = `880${cleaned.slice(1)}`;
    return `+${intlFormat.slice(0, 3)} ${intlFormat.slice(3, 5)} ${intlFormat.slice(5, 9)} ${intlFormat.slice(9)}`;
  }
  
  // Return original if unknown format
  return phone;
}

// Rest of the helper functions remain the same
function optimizeImageUrl(url) {
  if (!url.includes('google.com')) return url;
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=300&h=300&fit=cover`;
}

function initCardInteractions() {
  document.querySelectorAll('.card-container').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('a')) card.classList.toggle('flipped');
    });
  });
}

// Filter/Search Functionality
function setupEventListeners() {
  dom.searchInput.addEventListener('input', debounce(() => filterCards(), 300));
  dom.skillFilter.addEventListener('change', () => filterCards());
}

function populateSkillFilter() {
  const skills = [...new Set(membersData.flatMap(m => 
    m.skills?.split(',').map(s => s.trim()).filter(Boolean)
  ))].sort();

  dom.skillFilter.innerHTML = `
    <option value="">All Skills</option>
    ${skills.map(skill => `<option value="${skill.toLowerCase()}">${skill}</option>`).join('')}
  `;
}

function filterCards() {
  const searchTerm = dom.searchInput.value.toLowerCase();
  const selectedSkill = dom.skillFilter.value.toLowerCase();

  const filtered = membersData.filter(member => {
    const nameMatch = member.name?.toLowerCase().includes(searchTerm);
    const emailMatch = member.email?.toLowerCase().includes(searchTerm);
    const skillMatch = !selectedSkill || member.skills?.toLowerCase().includes(selectedSkill);
    
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
  dom.loader.style.display = show ? 'block' : 'none';
}

function showError(message) {
  dom.messageContainer.innerHTML = `
    <div class="error-message">
      <p>${message}</p>
      <button onclick="window.location.reload()">Retry</button>
    </div>
  `;
}
