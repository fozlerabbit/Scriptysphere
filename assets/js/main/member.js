document.getElementById('searchInput').addEventListener('input', function () {
    const filter = this.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.card-container');
    let hasResults = false;

    cards.forEach(card => {
        const name = card.querySelector('.name').textContent.toLowerCase();
        const memberId = card.querySelector('.code').textContent.toLowerCase();

        if (name.includes(filter) || memberId.includes(filter)) {
            card.style.display = 'block';
            hasResults = true;
        } else {
            card.style.display = 'none';
        }
    });

    const messageContainer = document.getElementById('message-container'); // Corrected ID
    if (filter === '') {
        messageContainer.style.display = 'none'; // Hide when input is empty
        cards.forEach(card => card.style.display = 'block'); // Show all cards
    } else if (hasResults) {
        messageContainer.style.display = 'none';
    } else {
        messageContainer.style.display = 'block';
    }
});


    document.addEventListener('DOMContentLoaded', function() {
        fetch('https://raw.githubusercontent.com/sinan544/profile/refs/heads/main/profile.json')
            .then(response => response.json())
            .then(jsonData => {
                const container = document.getElementById("card-section");

                // Create a container div for better layout
                const cardsContainer = document.createElement('div');
                cardsContainer.style.display = 'flex';
                cardsContainer.style.justifyContent = 'center';
                cardsContainer.style.flexWrap = 'wrap';
                cardsContainer.style.gap = '20px';
                cardsContainer.style.padding = '20px';
                container.appendChild(cardsContainer);

                jsonData.forEach(person => {
                    const card = document.createElement('div');
                    card.className = 'card-container';
                    card.style.margin = '10px';

                    // Handle Google Drive image links
                    const formalPhoto = person['Your Formal Photo'] ? 
                        person['Your Formal Photo'].replace('open?id=', 'uc?export=view&id=') :
                        'https://via.placeholder.com/150';

                    card.innerHTML = `
                        <div class="card-inner">
                            <div class="card-front">
                                <img src="${formalPhoto}" 
                                     alt="${person['Full Name (For Certificate)']}" 
                                     class="profile-img">
                                <h2 class="name">${person['Full Name (For Certificate)']?.trim() || 'No Name'}</h2>
                                <p class="role">${(person['Which Work Are You Interested on']?.split(',')[0] || 'Member').trim()}</p>
                                <p class="code">ID: ${(person['Email Address ']?.split('@')[0] || 'MEM000').toUpperCase()}</p>
                            </div>

                            <div class="card-back">
                                <div>
                                    <h3 class="name">About Me</h3>
                                    <p class="bio">${person['Tell us about yourself ?'] || 'No bio available'}</p>
                                </div>
                                
                                <div class="contact-info">
                                    ${person['  Phone Number   '] ? `<p><i class="fas fa-phone"></i> ${person['  Phone Number   ']}</p>` : ''}
                                    ${person['Email Address '] ? `<p><i class="fas fa-envelope"></i> ${person['Email Address ']}</p>` : ''}
                                    ${person['  Address (For Membership Card Delivery)'] ? `<p><i class="fas fa-map-marker-alt"></i> ${person['  Address (For Membership Card Delivery)']}</p>` : ''}
                                </div>

                                <div class="social-links">
                                    ${person['Facebook Id (Link)'] ? `
                                        <a href="${person['Facebook Id (Link)']}" class="facebook" target="_blank">
                                            <i class="fab fa-facebook-f"></i>
                                        </a>` : ''}
                                    
                                    ${person['Email Address '] ? `
                                        <a href="mailto:${person['Email Address ']}" class="email">
                                            <i class="fas fa-envelope"></i>
                                        </a>` : ''}
                                </div>
                            </div>
                        </div>
                    `;

                    // Add click handler for flipping
                    card.onclick = function() {
                        this.classList.toggle('flipped');
                    };

                    cardsContainer.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Error loading JSON data:', error);
                document.body.innerHTML = `<p style="color: red">Error loading data: ${error.message}</p>`;
            });
    });