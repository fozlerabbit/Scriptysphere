document.getElementById('searchInput').addEventListener('input', function () {
    const filter = this.value.toLowerCase();
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const name = card.querySelector('.card_title').textContent.toLowerCase();
        if (name.includes(filter)) {
            card.style.display = 'block';
            document.getElementById('nothing').style.display='none'
        } else {
            card.style.display = 'none';
            document.getElementById('nothing').style.display='block'
        }
    });
});
