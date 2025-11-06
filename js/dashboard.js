let currentUser = null;
let favorites = [];

document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    initDashboard();
});

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = localStorage.getItem('userData');
    
    if (isLoggedIn === 'true' && userData) {
        currentUser = JSON.parse(userData);
        showFavoritesSection();
    } else {
        showLoginSection();
    }
}

function showLoginSection() {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('profile-section').style.display = 'none';
    document.getElementById('favorites-section').style.display = 'none';
    
    // Initialize form validator
    new FormValidator('login-form');
    
    // Animate login form entrance
    animateLoginForm();
}

function animateLoginForm() {
    // GSAP Timeline Animation #1: Form entrance
    const formTimeline = gsap.timeline({ defaults: { ease: 'power2.out' } });
    
    formTimeline
        .from('.login-section', {
            opacity: 0,
            scale: 0.8,
            y: 50,
            duration: 0.8
        })
        .from('.login-section h2', {
            opacity: 0,
            y: -30,
            duration: 0.6
        }, '-=0.4')
        .from('.form-group', {
            opacity: 0,
            x: -30,
            stagger: 0.1,
            duration: 0.5
        }, '-=0.3');
    
    // Add focus animations to form inputs
    const inputs = document.querySelectorAll('.form-group input, .form-group select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to(input.parentElement, {
                scale: 1.02,
                boxShadow: '0 5px 20px rgba(27, 192, 185, 0.3)',
                duration: 0.3
            });
        });
        
        input.addEventListener('blur', () => {
            gsap.to(input.parentElement, {
                scale: 1,
                boxShadow: 'none',
                duration: 0.3
            });
        });
    });
}

function showFavoritesSection() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('profile-section').style.display = 'flex';
    document.getElementById('favorites-section').style.display = 'block';
    
    // Update greeting
    const greeting = document.getElementById('user-greeting');
    greeting.textContent = `HELLO, ${currentUser.username.toUpperCase()}!`;
    
    // Load and display favorites
    loadFavorites();
    displayFavorites();
    
    // Animate profile section
    animateProfileSection();
}

function animateProfileSection() {
    // GSAP Timeline Animation #2: Profile entrance
    const profileTimeline = gsap.timeline({ defaults: { ease: 'back.out(2)' } });
    
    profileTimeline
        .from('.profile-section', {
            opacity: 0,
            y: -50,
            duration: 0.8
        })
        .from('.profile-icon', {
            opacity: 0,
            scale: 0,
            rotation: -360,
            duration: 1
        }, '-=0.4')
        .from('.greeting', {
            opacity: 0,
            x: -50,
            duration: 0.8
        }, '-=0.5');
    
    // Animate greeting letters
    const greeting = document.querySelector('.greeting');
    if (greeting) {
        const letters = greeting.textContent.split('');
        greeting.textContent = '';
        
        letters.forEach(letter => {
            const span = document.createElement('span');
            span.textContent = letter === ' ' ? '\u00A0' : letter;
            span.style.display = 'inline-block';
            greeting.appendChild(span);
        });
        
        gsap.from('.greeting span', {
            opacity: 0,
            y: -30,
            rotation: Math.random() * 360,
            stagger: 0.05,
            duration: 0.5,
            ease: 'back.out(2)',
            delay: 0.8
        });
    }
    
    // Pulsing profile icon
    gsap.to('.profile-icon', {
        scale: 1.05,
        boxShadow: '0 10px 30px rgba(249, 70, 128, 0.5)',
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}

function loadFavorites() {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
        favorites = JSON.parse(savedFavorites);
    } else {
        favorites = [];
    }
}

async function displayFavorites() {
    const favoritesGrid = document.getElementById('favorites-grid');
    const emptyMessage = document.getElementById('empty-message');
    
    if (favorites.length === 0) {
        favoritesGrid.innerHTML = '';
        emptyMessage.style.display = 'block';
        
        // Animate empty message
        gsap.from(emptyMessage, {
            opacity: 0,
            scale: 0.5,
            duration: 0.8,
            ease: 'elastic.out(1, 0.5)'
        });
        return;
    }
    
    emptyMessage.style.display = 'none';
    favoritesGrid.innerHTML = '';
    
    for (const favoriteId of favorites) {
        try {
            const recipe = await fetchRecipeDetails(favoriteId);
            if (recipe) {
                const card = createRecipeCard(recipe);
                favoritesGrid.appendChild(card);
            }
        } catch (error) {
            console.error('Error loading favorite:', error);
        }
    }
    
    // GSAP Timeline Animation #3: Cards cascade entrance
    const cardsTimeline = gsap.timeline();
    
    cardsTimeline.from('.recipe-card', {
        opacity: 0,
        y: 50,
        scale: 0.5,
        rotation: -10,
        stagger: {
            each: 0.1,
            from: 'start'
        },
        duration: 0.6,
        ease: 'back.out(1.5)'
    });
    
    // ScrollTrigger Animation: Cards reveal on scroll
    gsap.utils.toArray('.recipe-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: index % 2 === 0 ? -50 : 50,
            rotation: index % 2 === 0 ? -5 : 5,
            duration: 0.8,
            ease: 'power2.out'
        });
    });
}

function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    
    const image = recipe.image || 'https://via.placeholder.com/300x200?text=No+Image';
    const title = recipe.title || 'Untitled Recipe';
    const readyTime = recipe.readyInMinutes || 'N/A';
    
    card.innerHTML = `
        <img src="${image}" alt="${title}" class="recipe-image">
        <div class="recipe-info">
            <h3 class="recipe-name">${title}</h3>
            <p class="recipe-time">Ready in: ${readyTime} min</p>
            <div class="card-actions">
                <button class="view-btn" onclick="viewRecipe(${recipe.id})">View Recipe</button>
                <button class="remove-btn" onclick="removeFromFavorites(${recipe.id})">
                    <span class="heart-icon">❤️</span> Remove
                </button>
            </div>
        </div>
    `;
    
    // Add hover animation
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            y: -15,
            boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
            duration: 0.3,
            ease: 'power2.out'
        });
        
        // Rotate heart icon
        const heartIcon = card.querySelector('.heart-icon');
        gsap.to(heartIcon, {
            rotation: 360,
            scale: 1.3,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)'
        });
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            y: 0,
            boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
            duration: 0.3,
            ease: 'power2.in'
        });
        
        const heartIcon = card.querySelector('.heart-icon');
        gsap.to(heartIcon, {
            rotation: 0,
            scale: 1,
            duration: 0.3
        });
    });
    
    return card;
}

function viewRecipe(recipeId) {
    // Animate transition
    gsap.to('.dashboard-container', {
        opacity: 0,
        scale: 0.95,
        duration: 0.5,
        onComplete: () => {
            window.location.href = `recipe-details.html?id=${recipeId}`;
        }
    });
}

function removeFromFavorites(recipeId) {
    const card = event.target.closest('.recipe-card');
    
    // GSAP Timeline Animation #4: Card removal
    const removeTimeline = gsap.timeline({
        onComplete: () => {
            favorites = favorites.filter(id => id !== recipeId);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            displayFavorites();
        }
    });
    
    removeTimeline
        .to(card, {
            rotation: 10,
            duration: 0.2
        })
        .to(card, {
            rotation: -10,
            duration: 0.2
        })
        .to(card, {
            rotation: 0,
            duration: 0.2
        })
        .to(card, {
            scale: 0,
            opacity: 0,
            rotation: 360,
            duration: 0.5,
            ease: 'back.in(2)'
        });
    
    // Create broken heart animation
    createBrokenHeartAnimation(card);
}

function createBrokenHeartAnimation(card) {
    const cardRect = card.getBoundingClientRect();
    
    // Create two heart halves
    for (let i = 0; i < 2; i++) {
        const heartHalf = document.createElement('div');
        heartHalf.textContent = i === 0 ? '💔' : '💔';
        heartHalf.style.position = 'fixed';
        heartHalf.style.fontSize = '3rem';
        heartHalf.style.left = `${cardRect.left + cardRect.width / 2}px`;
        heartHalf.style.top = `${cardRect.top + cardRect.height / 2}px`;
        heartHalf.style.pointerEvents = 'none';
        heartHalf.style.zIndex = '1000';
        
        document.body.appendChild(heartHalf);
        
        gsap.to(heartHalf, {
            x: i === 0 ? -100 : 100,
            y: 100,
            rotation: i === 0 ? -45 : 45,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            onComplete: () => heartHalf.remove()
        });
    }
}

function initDashboard() {
    // Add profile image placeholder
    const profileImg = document.getElementById('profile-img');
    if (profileImg) {
        profileImg.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iI2Y5NDY4MCIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTIwLDcwIFEzNSw1NSA1MCw1NSBUODAsNzAiIGZpbGw9IiNmZmYiLz48L3N2Zz4=';
    }
    
    // Create SVG decorations
    createDashboardDecorations();
}

function createDashboardDecorations() {
    const favoritesSection = document.querySelector('.favorites-section');
    if (!favoritesSection) return;
    
    // Create floating hearts SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'hearts-decoration');
    svg.setAttribute('viewBox', '0 0 1200 800');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '0';
    svg.style.opacity = '0.1';
    
    // Create multiple hearts
    for (let i = 0; i < 10; i++) {
        const heart = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const x = Math.random() * 1200;
        const y = Math.random() * 800;
        const size = 20 + Math.random() * 30;
        
        heart.setAttribute('d', `M${x},${y} C${x - size},${y - size} ${x - size * 2},${y} ${x},${y + size} C${x + size * 2},${y} ${x + size},${y - size} ${x},${y} Z`);
        heart.setAttribute('fill', '#f94680');
        svg.appendChild(heart);
        
        // SVG/MotionPath Animation: Hearts float up
        gsap.to(heart, {
            y: -200,
            opacity: 0,
            duration: 3 + Math.random() * 2,
            repeat: -1,
            delay: Math.random() * 3,
            ease: 'none'
        });
        
        // Add rotation
        gsap.to(heart, {
            rotation: 360,
            transformOrigin: `${x}px ${y}px`,
            duration: 4 + Math.random() * 2,
            repeat: -1,
            ease: 'none'
        });
    }
    
    favoritesSection.style.position = 'relative';
    favoritesSection.insertBefore(svg, favoritesSection.firstChild);
}