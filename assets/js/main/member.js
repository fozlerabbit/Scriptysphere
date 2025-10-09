const API_URL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLh7v1OxIJELHE8bvZFVV1KH5Mo4gEkD_Z42fi8uaoE81ND75LJtFCA4x_poADt3kFRv6YxdnGenSZR2QjQnEKJ0VYYHMIzwMWIV5sl0qSzGpt7kpsGSgaHBtyI75WVXBQY3CqENWdr0yAijMrxZI_Uh5cB44RgktkhlUbkA-s9iD18zNUcxmehcYfWi7_2iyKLUmfc1UAZrRKwuBXCDXZ46foyCgLFDQpZbOUxQYwAo4L8BuBj-Jf2TQKzdyxyE-CoJQEJL0TMwE5F9O7kxR29GbJvWNQ&lib=MddHsRbk_0E1-tyaBozepfl_55EKapUNo';

const DEFAULT_PHOTO = 'https://raw.githubusercontent.com/sinan544/profile/refs/heads/main/logo.png';
let membersData = [];
let memberCounter = 1;

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
        
        // Fixed: Properly extract array from response
        membersData = Array.isArray(json.data) ? json.data : [];
        
        if (membersData.length === 0) {
            throw new Error('No member data found');
        }
        
        // Generate member IDs and extract location data
        processMemberData();
        
        renderCards(membersData);
        populateSkillFilter();
        populateDivisionFilter();
    } catch (error) {
        throw new Error(`Failed to load members: ${error.message}`);
    }
}

function processMemberData() {
    memberCounter = 1;
    
    membersData.forEach((member, index) => {
        // Generate member ID in format SS2019xx
        member.memberId = generateMemberId(memberCounter++);
        
        // Extract division and district from address
        extractLocationFromAddress(member);
    });
}

function generateMemberId(counter) {
    // Format: SS2019 + two-digit number (01, 02, 03, ...)
    const numberPart = counter.toString().padStart(2, '0');
    return `SS2019${numberPart}`;
}

function extractLocationFromAddress(member) {
    if (!member.address) {
        member.division = 'Unknown';
        member.district = 'Unknown';
        return;
    }
    
    const address = member.address.toLowerCase();
    
    // Extract division
    let foundDivision = '';
    Object.keys(divisionDistrictMap).forEach(division => {
        if (address.includes(division.toLowerCase())) {
            foundDivision = division;
        }
    });
    
    member.division = foundDivision || 'Unknown';
    
    // Extract district
    let foundDistrict = '';
    if (foundDivision) {
        const districts = divisionDistrictMap[foundDivision];
        districts.forEach(district => {
            if (address.includes(district.toLowerCase())) {
                foundDistrict = district;
            }
        });
    }
    
    // If district not found in division, search in all districts
    if (!foundDistrict) {
        Object.values(divisionDistrictMap).flat().forEach(district => {
            if (address.includes(district.toLowerCase())) {
                foundDistrict = district;
            }
        });
    }
    
    member.district = foundDistrict || 'Unknown';
}

function renderCards(members) {
    if (!members || members.length === 0) {
        dom.cardSection.innerHTML = '<p class="text-center text-gray-500">No members found</p>';
        return;
    }
    
    dom.cardSection.innerHTML = members.map(member => createCardHTML(member)).join('');
    initCardInteractions();
}

function createCardHTML(member) {
    const facebookUrl = member.facebook?.startsWith('http') ? member.facebook : `https://facebook.com/${member.facebook}`;

    return `
        <div class="card-container">
            <div class="card-inner">
                <div class="card-front">
                    <img src="${optimizeImageUrl(member.photo)}" class="profile-img" alt="${member.name}" loading="lazy" onerror="this.src='${DEFAULT_PHOTO}'">
                    <h2>${member.name || 'Unknown Member'}</h2>
                    <p class="role">${member.skill || 'No Skill Listed'}</p>
                    <p class="role">${capitalize(member.division)} Division</p>
                    <p class="role">${capitalize(member.district)} District</p>
                    <p class="role">${member.date_of_birth || 'DOB not given'}</p>
                    <p class="member-id">${member.memberId || 'SS201900'}</p>
                </div>
                <div class="card-back">
                    <div class="bio">
                        <h3>About Me</h3>
                        <p>${member.about || 'No bio available'}</p>
                        ${member.address ? `<p class="address"><i class="fas fa-map-marker-alt"></i> ${member.address}</p>` : ''}
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

function setupEventListeners() {
    dom.searchInput.addEventListener('input', debounce(() => filterCards(), 300));
    dom.skillFilter.addEventListener('change', () => filterCards());
    dom.divisionFilter.addEventListener('change', () => {
        populateDistricts(dom.divisionFilter.value);
        filterCards();
    });
    dom.districtFilter.addEventListener('change', () => filterCards());
}

function filterCards() {
    const searchTerm = dom.searchInput.value.toLowerCase();
    const selectedSkill = dom.skillFilter.value.toLowerCase();
    const selectedDivision = dom.divisionFilter.value.toLowerCase();
    const selectedDistrict = dom.districtFilter.value.toLowerCase();

    const filtered = membersData.filter(member => {
        const nameMatch = member.name?.toLowerCase().includes(searchTerm);
        const emailMatch = member.email?.toLowerCase().includes(searchTerm);
        const memberIdMatch = member.memberId?.toLowerCase().includes(searchTerm);
        const skillMatch = !selectedSkill || member.skill?.toLowerCase().includes(selectedSkill);
        const divisionMatch = !selectedDivision || member.division?.toLowerCase() === selectedDivision;
        const districtMatch = !selectedDistrict || member.district?.toLowerCase() === selectedDistrict;

        return (nameMatch || emailMatch || memberIdMatch) && skillMatch && divisionMatch && districtMatch;
    });

    renderCards(filtered);
    updateMessage(filtered.length);
}

function updateMessage(count) {
    if (count === 0) {
        dom.messageContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No members found</h3>
                <p>Try adjusting your search criteria or filters</p>
            </div>
        `;
    } else {
        dom.messageContainer.innerHTML = `
            <div class="results-count">
                <span class="count">${count}</span> member${count !== 1 ? 's' : ''} found
            </div>
        `;
    }
}

function populateSkillFilter() {
    const skills = [...new Set(membersData.flatMap(m => 
        m.skill?.split(',').map(s => s.trim()).filter(Boolean) || []
    ))].sort();
    
    dom.skillFilter.innerHTML = `<option value="">All Skills</option>` +
        skills.map(skill => `<option value="${skill.toLowerCase()}">${skill}</option>`).join('');
}

function populateDivisionFilter() {
    const divisions = [...new Set(membersData.map(m => m.division).filter(Boolean))].sort();
    dom.divisionFilter.innerHTML = `<option value="">All Divisions</option>` +
        divisions.map(d => `<option value="${d.toLowerCase()}">${capitalize(d)} Division</option>`).join('');
}

function populateDistricts(selectedDivision) {
    let districts = [];
    
    if (selectedDivision && divisionDistrictMap[selectedDivision]) {
        // Get districts from the predefined map
        districts = divisionDistrictMap[selectedDivision];
    } else {
        // Get unique districts from member data
        districts = [...new Set(membersData
            .filter(m => !selectedDivision || m.division === selectedDivision)
            .map(m => m.district)
            .filter(Boolean)
        )].sort();
    }
    
    dom.districtFilter.innerHTML = `<option value="">All Districts</option>` +
        districts.map(d => `<option value="${d.toLowerCase()}">${capitalize(d)} District</option>`).join('');
}

// Bangladeshi Phone Number Formatter
function formatBangladeshiPhone(phone) {
    if (!phone) return '';
    
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
    if (!url || !url.includes('google.com')) return url || DEFAULT_PHOTO;
    return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=300&h=300&fit=cover`;
}

// Flip Interaction
function initCardInteractions() {
    document.querySelectorAll('.card-container').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('a')) {
                card.classList.toggle('flipped');
            }
        });
    });
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
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
            <button onclick="window.location.reload()">Retry</button>
        </div>
    `;
}

function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}