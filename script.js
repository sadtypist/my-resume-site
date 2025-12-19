/* Game Hub Logic */

// Function to handle Sign Up
function handleJoin(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value;

    if (username) {
        localStorage.setItem('goh_username', username);
        // Initialize default lists if empty
        if (!localStorage.getItem('goh_likes')) {
            localStorage.setItem('goh_likes', JSON.stringify(['Minecraft', 'Stardew Valley', 'Portal 2']));
        }
        if (!localStorage.getItem('goh_playing')) {
            localStorage.setItem('goh_playing', JSON.stringify(['Valorant', 'Fortnite']));
        }
        if (!localStorage.getItem('goh_rotation')) {
            localStorage.setItem('goh_rotation', JSON.stringify(['Elden Ring', 'Cyberpunk 2077']));
        }
        window.location.href = 'dashboard.html';
    } else {
        alert('Please enter a Gamertag!');
    }
}

// Function to load Dashboard data
function loadDashboard() {
    // Load Username
    const storedName = localStorage.getItem('goh_username');
    if (storedName) {
        document.getElementById('display-username').textContent = storedName;
    }

    // Load Lists
    // Load Lists
    renderList('likes-list', 'goh_likes');
    renderList('playing-list', 'goh_playing');
    renderList('rotation-list', 'goh_rotation');
    renderReviews();
}

// Save a new Review
function saveReview() {
    const game = document.getElementById('review-game').value;
    const rating = document.getElementById('review-rating').value;
    const text = document.getElementById('review-text').value;

    if (game && rating) {
        const reviews = JSON.parse(localStorage.getItem('goh_reviews')) || [];
        reviews.push({ game, rating, text });
        localStorage.setItem('goh_reviews', JSON.stringify(reviews));
        alert('Review Saved!');
        window.location.href = 'dashboard.html';
    } else {
        alert('Please fill in game title and rating.');
    }
}

// Open Steam Search for the game
function openSteam() {
    const game = document.getElementById('review-game').value;
    if (game) {
        // Search Steam for the game title
        window.open(`https://store.steampowered.com/search/?term=${encodeURIComponent(game)}`, '_blank');
    } else {
        alert('Enter a game title first!');
    }
}

// Render Reviews specifically (different format than simple lists)
function renderReviews() {
    const listElement = document.getElementById('reviews-list');
    if (!listElement) return; // Guard clause if we are not on dashboard

    const savedReviews = JSON.parse(localStorage.getItem('goh_reviews')) || [];
    listElement.innerHTML = '';

    savedReviews.forEach((review, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${review.game}</strong> <span style="color: gold;">★ ${review.rating}/10</span>
                <p style="font-size: 0.9rem; color: #aaa; margin: 5px 0;">${review.text}</p>
            </div>
            <span class="delete-btn" onclick="removeItem('goh_reviews', ${index}, 'reviews-list'); location.reload();">×</span>
        `;
        listElement.appendChild(li);
    });
}

// Render a list from localStorage
function renderList(elementId, storageKey) {
    const listElement = document.getElementById(elementId);
    const savedItems = JSON.parse(localStorage.getItem(storageKey)) || [];

    listElement.innerHTML = ''; // Clear current list

    savedItems.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item} 
            <span class="delete-btn" onclick="removeItem('${storageKey}', ${index}, '${elementId}')">×</span>
        `;
        listElement.appendChild(li);
    });
}

// Add a new item to a list
function addItem(inputId, storageKey, listId) {
    const input = document.getElementById(inputId);
    const value = input.value;

    if (value) {
        const items = JSON.parse(localStorage.getItem(storageKey)) || [];
        items.push(value);
        localStorage.setItem(storageKey, JSON.stringify(items));
        input.value = ''; // Clear input
        renderList(listId, storageKey);
    }
}

// Remove an item from a list
function removeItem(storageKey, index, listId) {
    const items = JSON.parse(localStorage.getItem(storageKey)) || [];
    items.splice(index, 1);
    localStorage.setItem(storageKey, JSON.stringify(items));
    renderList(listId, storageKey);
}

// Check which page we are on and run appropriate code
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('dashboard.html')) {
        loadDashboard();
    }

    // Attach listener to signup button if it exists
    const joinBtn = document.querySelector('.submit-btn-join');
    if (joinBtn) {
        joinBtn.addEventListener('click', handleJoin);
    }
});
