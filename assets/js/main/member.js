
// Updated full JavaScript with responsive cards and working filters

const API_URL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLh7v1OxIJELHE8bvZFVV1KH5Mo4gEkD_Z42fi8uaoE81ND75LJtFCA4x_poADt3kFRv6YxdnGenSZR2QjQnEKJ0VYYHMIzwMWIV5sl0qSzGpt7kpsGSgaHBtyI75WVXBQY3CqENWdr0yAijMrxZI_Uh5cB44RgktkhlUbkA-s9iD18zNUcxmehcYfWi7_2iyKLUmfc1UAZrRKwuBXCDXZ46foyCgLFDQpZbOUxQYwAo4L8BuBj-Jf2TQKzdyxyE-CoJQEJL0TMwE5F9O7kxR29GbJvWNQ&lib=MddHsRbk_0E1-tyaBozepfl_55EKapUNo';
 
// const API_URL = 'https://script.google.com/macros/s/AKfycbwphz5L1804nvRdM2S_p-t_gglZ3z7ruLCgXwicwGMhQOZg6mCs7kEDSwTVrULN2G_M/exec';
 

const DEFAULT_PHOTO = 'https://raw.githubusercontent.com/sinan544/profile/refs/heads/main/logo.png';
let membersData = [];

const divisionDistrictMap = {
  barishal: ["barishal", "barguna", "bhola", "jhalokathi", "patukhali", "pirojpur"],
  chattogram: ["chattogram", "bandarban", "brahmanbaria", "chakaria", "cox's bazar", "comilla", "feni", "khagrachari", "lakshmipur", "noakhali", "rangamati"],
  dhaka: ["dhaka", "faridpur", "gazipur", "gopalganj", "kishoreganj", "madaripur", "manikganj", "munshiganj", "narayanganj", "narsingdi", "rajbari", "shariatpur", "tangail"],
  khulna: ["khulna", "bagerhat", "chuadanga", "jashore", "jhenaidah", "kushtia", "magura", "meherpur", "narail", "satkhira"],
  rajshahi: ["rajshahi", "bogura", "chapainawabganj", "joypurhat", "naogaon", "natore", "pabna", "sirajganj"],
  rangpur: ["rangpur", "dinajpur", "gaibandha", "kurigram", "lalmonirhat", "nilphamari", "panchagarh", "thakurgaon"],
  sylhet: ["sylhet", "habiganj", "maulvibazar", "sunamganj"],
  mymensingh: ["mymensingh", "netrokona", "sherpur", "jamalpur"]
};

const dom = {
  searchInput: document.getElementById('searchInput'),
  skillFilter: document.getElementById('skillFilter'),
  divisionFilter: document.getElementById('divisionFilter'),
  districtFilter: document.getElementById('districtFilter'),
  dobFilter: document.getElementById('dobFilter'),
  cardSection: document.getElementById('cardSection'),
  messageContainer: document.getElementById('messageContainer'),
  loader: document.getElementById('loader')
};

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

async function loadMembers() {
  try {
    const response = await fetch(API_URL);
    validateResponse(response);
    const json = await response.json();
 
    membersData = json.data || [];
 
    membersData = json.data || []; // ✅ FIXED: extract array properly
 
    renderCards(membersData);
    populateSkillFilter();
    populateDivisionFilter();
    populateDOBFilter();
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
          <img src="${optimizeImageUrl(member.photo)}" class="profile-img" alt="${member.name}" loading="lazy" onerror="this.src='${DEFAULT_PHOTO}'">
          <h2 style="text-align:center;">${member.name}</h2>
 
          <p class="role">${member.skill || 'No Skill Listed'}</p>
          <p class="role">${member.division || 'No Division'}</p>
          <p class="role">${member.district || 'No District'}</p>
          <p class="role">${member.dob || 'DOB not given'}</p>
 
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
 
            ${member.facebook ? `<a href="${facebookUrl}" class="social-link" target="_blank" rel="noopener"><i class="fab fa-facebook"></i></a>` : ''}
            ${member.email ? `<a href="mailto:${member.email}" class="social-link"><i class="fas fa-envelope"></i></a>` : ''}
 
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

 
function setupEventListeners() {
  dom.searchInput.addEventListener('input', debounce(() => filterCards(), 300));
  dom.skillFilter.addEventListener('change', () => filterCards());
  dom.divisionFilter.addEventListener('change', () => {
    populateDistricts(dom.divisionFilter.value);
    filterCards();
  });
  dom.districtFilter.addEventListener('change', () => filterCards());
  dom.dobFilter.addEventListener('change', () => filterCards());
}

function filterCards() {
  const searchTerm = dom.searchInput.value.toLowerCase();
  const selectedSkill = dom.skillFilter.value.toLowerCase();
  const selectedDivision = dom.divisionFilter.value.toLowerCase();
  const selectedDistrict = dom.districtFilter.value.toLowerCase();
  const selectedDOB = dom.dobFilter.value;

  const filtered = membersData.filter(member => {
    const nameMatch = member.name?.toLowerCase().includes(searchTerm);
    const emailMatch = member.email?.toLowerCase().includes(searchTerm);
    const skillMatch = !selectedSkill || member.skill?.toLowerCase().includes(selectedSkill);
    const divisionMatch = !selectedDivision || member.division?.toLowerCase() === selectedDivision;
    const districtMatch = !selectedDistrict || member.district?.toLowerCase() === selectedDistrict;
    const dobMatch = !selectedDOB || member.dob === selectedDOB;

    return (nameMatch || emailMatch) && skillMatch && divisionMatch && districtMatch && dobMatch;
  });

  renderCards(filtered);
  dom.messageContainer.textContent = filtered.length ? '' : 'Be the first person from this place!';
}

function populateSkillFilter() {
  const skills = [...new Set(membersData.flatMap(m => m.skill?.split(',').map(s => s.trim()).filter(Boolean)))].sort();
  dom.skillFilter.innerHTML = `<option value="">All Skills</option>` +
    skills.map(skill => `<option value="${skill.toLowerCase()}">${skill}</option>`).join('');
}

function populateDivisionFilter() {
  const divisions = Object.keys(divisionDistrictMap);
  dom.divisionFilter.innerHTML = `<option value="">All Divisions</option>` +
    divisions.map(d => `<option value="${d}">${capitalize(d)}</option>`).join('');
}

function populateDistricts(selectedDivision) {
  const districts = divisionDistrictMap[selectedDivision] || [];
  dom.districtFilter.innerHTML = `<option value="">All Districts</option>` +
    districts.map(d => `<option value="${d}">${capitalize(d)}</option>`).join('');
}

function populateDOBFilter() {
  const dobs = [...new Set(membersData.map(m => m.dob).filter(Boolean))].sort();
  dom.dobFilter.innerHTML = `<option value="">All DOBs</option>` +
    dobs.map(dob => `<option value="${dob}">${dob}</option>`).join('');
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
 

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
 
 
