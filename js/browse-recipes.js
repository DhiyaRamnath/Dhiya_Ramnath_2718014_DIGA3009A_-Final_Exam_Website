let allRecipes = [];
let filteredRecipes = [];
let currentCategory = '';
let currentSort = 'random';

if (typeof API_KEY === 'undefined') {
    console.error('API_KEY not found. Please ensure api.js is loaded first.');
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, API_KEY:', API_KEY);
    initFilters();
    loadRecipes();
    loadPopularRecipes();
    initScrollAnimations();
    initCorianderAnimation();
    initLetterHoverEffect();
});

function initLetterHoverEffect() {
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        const text = pageTitle.textContent;
        pageTitle.innerHTML = '';
        pageTitle.style.letterSpacing = '0.1rem';
        
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.className = 'hover-letter';
            span.textContent = text[i];
            if (text[i] === ' ') {
                span.style.width = '1rem';
                span.style.display = 'inline-block';
            }
            pageTitle.appendChild(span);
        }
    }
    
    const popularTitle = document.getElementById('popular-title');
    if (popularTitle) {
        const text = popularTitle.textContent;
        popularTitle.innerHTML = '';
        
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.className = 'hover-letter';
            span.textContent = text[i];
            if (text[i] === ' ') {
                span.style.marginRight = '0.5rem';
            }
            popularTitle.appendChild(span);
        }
    }
}

function initCorianderAnimation() {
    const corianderLeft = document.querySelector('.coriander-left');
    const corianderRight = document.querySelector('.coriander-right');
    
    if (corianderLeft) {
        gsap.fromTo(corianderLeft, 
            { y: -30 },
            {
                y: 30,
                duration: 3,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            }
        );
    }
    
    if (corianderRight) {
        gsap.fromTo(corianderRight,
            { y: 30 },
            {
                y: -30,
                duration: 3.5,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                delay: 0.5
            }
        );
    }
}

function initFilters() {
    const applyBtn = document.getElementById('apply-filter');
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            currentCategory = categoryFilter.value;
            currentSort = sortFilter.value;
            loadRecipes();
        });
    }
}

async function loadRecipes() {
    const grid = document.getElementById('recipe-grid');
    grid.innerHTML = '<p class="loading-message">Loading delicious recipes...</p>';
    
    try {
        console.log('Starting to load recipes...');
        console.log('API_KEY available:', typeof API_KEY !== 'undefined');
        
        let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=20&addRecipeInformation=true`;
        
        if (currentCategory) {
            url += `&type=${currentCategory}`;
        }
        
        if (currentSort === 'time') {
            url += `&sort=time`;
        } else if (currentSort === 'popularity') {
            url += `&sort=popularity`;
        } else {
            url += `&sort=random`;
        }
        
        console.log('Fetching URL:', url);
        
        const response = await fetch(url);
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            throw new Error(`Failed to fetch recipes: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Recipes loaded:', data.results?.length || 0);
        
        allRecipes = data.results || [];
        
        if (allRecipes.length === 0) {
            grid.innerHTML = '<p class="loading-message">No recipes found. Try different filters!</p>';
            return;
        }
        
        displayRecipes(allRecipes);
        
    } catch (error) {
        console.error('Error loading recipes:', error);
        grid.innerHTML = `<p class="loading-message">Unable to load recipes. Error: ${error.message}<br>Please check the console for details.</p>`;
    }
}

function displayRecipes(recipes) {
    const grid = document.getElementById('recipe-grid');
    grid.innerHTML = '';
    
    if (recipes.length === 0) {
        grid.innerHTML = '<p class="loading-message">No recipes found. Try different filters!</p>';
        return;
    }
    
    recipes.forEach((recipe, index) => {
        const card = createRecipeCard(recipe, index);
        grid.appendChild(card);
    });
    
    animateRecipeCards();
}

function createRecipeCard(recipe, index) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.dataset.index = index;
    
    const isFavorite = isRecipeFavorite(recipe.id);
    
    card.innerHTML = `
        <img src="${recipe.image || 'https://via.placeholder.com/300x250?text=No+Image'}" alt="${recipe.title}" class="recipe-card-image">
        <div class="recipe-card-info">
            <h3 class="recipe-card-title">${recipe.title}</h3>
            <div class="recipe-card-meta">
                <div class="meta-item-card">
                    <span>⏱️</span>
                    <span>${recipe.readyInMinutes || 30} mins</span>
                </div>
                <div class="meta-item-card">
                    <span>🍽️</span>
                    <span>${recipe.servings || 4} servings</span>
                </div>
            </div>
            <div class="recipe-card-actions">
                <button class="view-recipe-btn" onclick="viewRecipe(${recipe.id})">View Recipe</button>
                <button class="favorite-card-btn ${isFavorite ? 'favorited' : ''}" onclick="toggleFavoriteCard(${recipe.id}, '${recipe.title.replace(/'/g, "\\'")}', '${recipe.image}', ${recipe.readyInMinutes || 30}, this)">
                    ${isFavorite ? '❤️' : '♥'}
                </button>
            </div>
        </div>
    `;
    
    return card;
}

async function loadPopularRecipes() {
    const grid = document.getElementById('popular-grid');
    
    try {
        console.log('Loading popular recipes...');
        
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=10&sort=popularity&addRecipeInformation=true`);
        
        console.log('Popular recipes response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Popular API Error:', errorText);
            throw new Error(`Failed to fetch popular recipes: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Popular recipes loaded:', data.results?.length || 0);
        
        displayPopularRecipes(data.results || []);
        
    } catch (error) {
        console.error('Error loading popular recipes:', error);
        grid.innerHTML = `<p class="loading-message">Unable to load popular recipes. Error: ${error.message}</p>`;
    }
}

function displayPopularRecipes(recipes) {
    const grid = document.getElementById('popular-grid');
    grid.innerHTML = '';
    
    if (recipes.length === 0) {
        grid.innerHTML = '<p class="loading-message">No popular recipes found.</p>';
        return;
    }
    
    recipes.forEach((recipe, index) => {
        const card = createRecipeCard(recipe, index);
        grid.appendChild(card);
    });

    animatePopularCards();
}

function viewRecipe(recipeId) {
    window.location.href = `recipe-details.html?id=${recipeId}`;
}

function isRecipeFavorite(recipeId) {
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    return favorites.some(fav => fav.id === recipeId);
}

function toggleFavoriteCard(recipeId, title, image, time, button) {
    let favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    const existingIndex = favorites.findIndex(fav => fav.id === recipeId);
    
    if (existingIndex > -1) {
        favorites.splice(existingIndex, 1);
        button.classList.remove('favorited');
        button.textContent = '♥';
        showNotification('Removed from favorites!');
    } else {
        favorites.push({
            id: recipeId,
            title: title,
            image: image,
            readyInMinutes: time
        });
        button.classList.add('favorited');
        button.textContent = '❤️';
        showNotification('Added to favorites!');
    }
    
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
        const profile = JSON.parse(userProfile);
        profile.favorites = favorites;
        localStorage.setItem('userProfile', JSON.stringify(profile));
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: var(--teal);
        color: white;
        padding: 1rem 2rem;
        border-radius: 25px;
        font-family: "Sniglet", sans-serif;
        font-size: 1.1rem;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);
}

function animateRecipeCards() {
    const cards = document.querySelectorAll('#recipe-grid .recipe-card');
    
    cards.forEach((card, index) => {
        ScrollTrigger.create({
            trigger: card,
            start: 'top 85%',
            onEnter: () => {
                gsap.to(card, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                    delay: index * 0.05
                });
            },
            once: true
        });
    });
}

function animatePopularCards() {
    const cards = document.querySelectorAll('#popular-grid .recipe-card');
    ScrollTrigger.create({
        trigger: '.popular-section',
        start: 'top 80%',
        onEnter: () => {
            gsap.to(cards, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out'
            });
        },
        once: true
    });
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);