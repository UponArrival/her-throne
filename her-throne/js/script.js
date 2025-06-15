// Password Protection
const correctPassword = '12345';
window.onload = () => {
    document.getElementById('password-modal').style.display = 'flex';
};
function checkPassword() {
    const input = document.getElementById('password-input').value;
    if (input === correctPassword) {
        document.getElementById('password-modal').style.display = 'none';
    } else {
        alert('Incorrect key. Beg for access.');
    }
}

// Scroll to Decrees
function scrollToDecrees() {
    window.scrollTo({ top: document.getElementById('decrees').offsetTop, behavior: 'smooth' });
}

// Typing Animation
var typed = new Typed('#tagline', {
    strings: [
        'A Sanctuary for Mackenzie',
        'Her Power Reigns Supreme',
        'Bow to Her Glory',
        'Kneel Before Her Majesty',
        'Mackenzie\'s Reign is Eternal',
        'Her Will Commands All',
        'Embrace Her Divine Rule',
        'Mackenzie\'s Glory Shines Bright'
    ],
    typeSpeed: 50,
    backSpeed: 30,
    loop: true,
    smartBackspace: true
});

// Loyalty Counter
let loyalty = localStorage.getItem('loyalty') || 0;
document.getElementById('loyalty-counter').textContent = loyalty;

function promptDonation() {
    let response;
    let validInput = false;

    while (!validInput) {
        response = prompt('Would you like to tribute the Queen via payment? (Type "Yes" or "No")');
        
        if (response === null || response.trim() === '') {
            alert('Please enter "Yes" or "No".');
            continue;
        }

        response = response.trim().toLowerCase();

        if (response === 'yes') {
            loyalty++;
            localStorage.setItem('loyalty', loyalty);
            document.getElementById('loyalty-counter').textContent = loyalty;
            alert('Your tribute strengthens your bond to Her eternal reign.');
            window.open('https://cash.app/$yourownermackenzie', '_blank');
            validInput = true;
        } else if (response === 'no') {
            alert('A true devotee honors their Queen with tributes. Do better.');
            validInput = true;
        } else {
            alert('Please enter "Yes" or "No".');
        }
    }
}

function resetLoyalty() {
    if (confirm('Are you sure you want to reset the loyalty counter? This cannot be undone.')) {
        localStorage.removeItem('loyalty');
        loyalty = 0;
        document.getElementById('loyalty-counter').textContent = loyalty;
        alert('Loyalty counter has been reset.');
    }
}

// Messages of Devotion
let devotions = JSON.parse(localStorage.getItem('devotions')) || [];

function renderDevotions() {
    const gallery = document.getElementById('devotion-gallery');
    const placeholder = document.getElementById('placeholder-message');
    const recentDevotions = devotions.slice(-4);

    if (recentDevotions.length === 0) {
        placeholder.classList.remove('hidden');
        Array.from(gallery.children).forEach(child => {
            if (child !== placeholder) {
                child.remove();
            }
        });
    } else {
        placeholder.classList.add('hidden');
        Array.from(gallery.children).forEach(child => {
            if (child !== placeholder) {
                child.remove();
            }
        });
        const cards = recentDevotions.map(d => `
            <div class="devotion-card">
                <h3>${d.name}</h3>
                <p>${d.date}</p>
                <p>${d.message}</p>
            </div>
        `).join('');
        gallery.insertAdjacentHTML('beforeend', cards);
    }

    renderOlderMessages();
}

function renderOlderMessages() {
    const olderMessagesList = document.getElementById('older-messages-list');
    const olderMessagesContainer = document.getElementById('older-messages');
    const viewAllBtn = document.getElementById('view-all-btn');

    if (devotions.length > 4) {
        const olderDevotions = devotions.slice(0, -4);
        olderMessagesList.innerHTML = olderDevotions.map(d => `
            <div class="devotion-card">
                <h3>${d.name}</h3>
                <p>${d.date}</p>
                <p>${d.message}</p>
            </div>
        `).join('');
        viewAllBtn.classList.remove('hidden');
    } else {
        olderMessagesList.innerHTML = '';
        olderMessagesContainer.classList.remove('visible');
        olderMessagesContainer.classList.add('hidden');
        viewAllBtn.classList.add('hidden');
    }
}

function addDevotion() {
    const maxNameLength = 20;
    const maxMessageLength = 50;
    let name, message;

    while (true) {
        name = prompt('Enter your name (max 20 characters):');
        if (name === null) return;
        name = name.trim();
        if (name === '') {
            alert('Name cannot be empty.');
            continue;
        }
        if (name.length > maxNameLength) {
            alert(`Name is too long (${name.length} characters). Please shorten it to ${maxNameLength} characters or less.`);
            continue;
        }
        break;
    }

    while (true) {
        message = prompt('Enter your devotion message for the Queen (max 50 characters):');
        if (message === null) return;
        message = message.trim();
        if (message === '') {
            alert('Message cannot be empty.');
            continue;
        }
        if (message.length > maxMessageLength) {
            alert(`Message is too long (${message.length} characters). Please shorten it to ${maxMessageLength} characters or less.`);
            continue;
        }
        break;
    }

    const devotion = { name, date: new Date().toLocaleDateString(), message };
    devotions.push(devotion);
    localStorage.setItem('devotions', JSON.stringify(devotions));
    renderDevotions();
}

function toggleOlderMessages() {
    const olderMessages = document.getElementById('older-messages');
    const viewAllBtn = document.getElementById('view-all-btn');
    if (olderMessages.classList.contains('hidden')) {
        olderMessages.classList.remove('hidden');
        olderMessages.classList.add('visible');
        viewAllBtn.textContent = 'Hide Older Messages';
        olderMessages.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        olderMessages.classList.remove('visible');
        olderMessages.classList.add('hidden');
        viewAllBtn.textContent = 'View All Devotion Messages';
    }
}

function resetDevotions() {
    if (confirm('Are you sure you want to reset all devotion messages? This cannot be undone.')) {
        localStorage.removeItem('devotions');
        devotions = [];
        renderDevotions();
        alert('Messages have been reset.');
    }
}

// Timeline Navigation
function scrollTimeline(direction) {
    const timeline = document.querySelector('.timeline');
    const cardWidth = document.querySelector('.timeline-card').offsetWidth + 32;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    timeline.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(updateArrowVisibility, 300);
}

function updateArrowVisibility() {
    const timeline = document.querySelector('.timeline');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    const scrollLeft = timeline.scrollLeft;
    const maxScrollLeft = timeline.scrollWidth - timeline.clientWidth;

    // Hide left arrow if at the beginning
    if (scrollLeft <= 0) {
        leftArrow.style.display = 'none';
    } else {
        leftArrow.style.display = 'flex';
    }

    // Hide right arrow if at the end (with a small tolerance for rounding errors)
    if (scrollLeft >= maxScrollLeft - 1) {
        rightArrow.style.display = 'none';
    } else {
        rightArrow.style.display = 'flex';
    }
}

// Initialize arrow visibility on page load and on scroll
document.addEventListener('DOMContentLoaded', () => {
    const timeline = document.querySelector('.timeline');
    if (timeline) {
        updateArrowVisibility(); // Initial check
        timeline.addEventListener('scroll', updateArrowVisibility);
    }
});

// Reinitialize arrow visibility if DOM changes (e.g., new cards added)
function reinitializeTimeline() {
    const timeline = document.querySelector('.timeline');
    if (timeline) {
        updateArrowVisibility();
    }
}
window.addEventListener('resize', reinitializeTimeline);

// Initial Render
renderDevotions();