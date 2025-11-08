const starColors = ['blue-star', 'green-star', 'orange-star', 'pink-star', 'yellow-star'];
const colors = ['color-teal', 'color-orange', 'color-pink'];
let currentRecipes = [];

document.addEventListener('DOMContentLoaded', () => {
    initSpinningStars();
    initLetterHoverEffect();
    initScrollAnimations();
    load3RandomRecipes();
    initRefreshButton();
});

function initLetterHoverEffect() {
    const surpriseTitle = document.getElementById('surprise-title');
    if (surpriseTitle) {
        const text = surpriseTitle.textContent;
        surpriseTitle.innerHTML = '';
        
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.className = 'hover-letter';
            span.textContent = text[i];
            if (text[i] === ' ') {
                span.style.marginRight = '0.5rem';
            }
            surpriseTitle.appendChild(span);
        }
    }
}

function initSpinningStars() {
    const container = document.getElementById('stars-background');
    const numStars = 15;
    
    for (let i = 0; i < numStars; i++) {
        const starEl = document.createElement('div');
        starEl.className = 'spinning-star';
        
        const starColor = starColors[Math.floor(Math.random() * starColors.length)];
        const img = document.createElement('img');
        img.src = `assets/${starColor}.png`;
        img.alt = starColor;
        img.onerror = () => {
            console.log(`Star image not found: ${starColor}.png`);
            starEl.remove();
        };
        
        starEl.appendChild(img);
        container.appendChild(starEl);
        
        // Random starting position
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        
        gsap.set(starEl, {
            x: startX,
            y: startY,
            rotation: Math.random() * 360
        });
        
        // Create spinning and moving animation
        const timeline = gsap.timeline({ repeat: -1 });
        
        // Random path for star to move
        const path = [];
        for (let j = 0; j < 4; j++) {
            path.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                rotation: Math.random() * 720 - 360
            });
        }
        
        path.forEach((point, index) => {
            timeline.to(starEl, {
                x: point.x,
                y: point.y,
                rotation: `+=${point.rotation}`,
                duration: 8 + Math.random() * 4,
                ease: 'sine.inOut',
                delay: index === 0 ? Math.random() * 2 : 0
            });
        });
        
        // Return to start
        timeline.to(starEl, {
            x: startX,
            y: startY,
            rotation: '+=360',
            duration: 8 + Math.random() * 4,
            ease: 'sine.inOut'
        });
    }
}

function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    ScrollTrigger.create({
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
    });
}

function initRefreshButton() {
    const refreshBtn = document.getElementById('refresh-button');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            gsap.to('.flip-card', {
                opacity: 0,
                y: -50,
                scale: 0.8,
                duration: 0.4,
                stagger: 0.1,
                onComplete: () => {
                    load3RandomRecipes();
                }
            });
        });
    }
}

async function load3RandomRecipes() {
    const grid = document.getElementById('cards-grid');
    grid.innerHTML = '<p class="loading-message">Loading mystery recipes...</p>';
    
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=3`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch recipes');
        }

        const data = await response.json();
        currentRecipes = data.recipes || [];
        
        if (currentRecipes.length === 0) {
            grid.innerHTML = '<p class="loading-message">No recipes found. Try refreshing!</p>';
            return;
        }
        
        display3Cards(currentRecipes);
        
    } catch (error) {
        console.error('Error loading random recipes:', error);
        grid.innerHTML = '<p class="loading-message">Unable to load recipes. Please try again!</p>';
    }
}

function display3Cards(recipes) {
    const grid = document.getElementById('cards-grid');
    grid.innerHTML = '';
    
    recipes.forEach((recipe, index) => {
        const card = createFlipCard(recipe, index);
        grid.appendChild(card);
    });
    
    animateCardsIn();
}

function createFlipCard(recipe, index) {
    const flipCard = document.createElement('div');
    flipCard.className = 'flip-card';
    flipCard.dataset.index = index;
    
    const randomColor = colors[index % colors.length];
    
    let summary = 'A delicious recipe waiting for you to try!';
    if (recipe.summary) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = recipe.summary;
        const text = tempDiv.textContent || tempDiv.innerText;
        const sentences = text.split('.').slice(0, 2);
        summary = sentences.join('.') + '.';
    }
    
    flipCard.innerHTML = `
        <div class="flip-card-inner">
            <div class="flip-card-front ${randomColor}">
                <img src="assets/iwe-logo.png" alt="Incy Wincy Eats" class="card-logo">
                <h2 class="card-message">Click to reveal your mystery recipe!</h2>
            </div>
            <div class="flip-card-back">
                <img src="${recipe.image || 'https://via.placeholder.com/400x250?text=Recipe'}" alt="${recipe.title}" class="recipe-image-large">
                <div class="recipe-details">
                    <h2 class="recipe-title-large">${recipe.title}</h2>
                    <div class="recipe-meta">
                        <span class="meta-item">
                            <strong>⏱️ Time:</strong> ${recipe.readyInMinutes || 30} mins
                        </span>
                        <span class="meta-item">
                            <strong>🍽️ Servings:</strong> ${recipe.servings || 4}
                        </span>
                    </div>
                    <div class="recipe-summary">${summary}</div>
                    <div class="recipe-actions">
                        <button class="view-full-btn" onclick="viewRecipe(${recipe.id})">View Full Recipe</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const cardFront = flipCard.querySelector('.flip-card-front');
    cardFront.addEventListener('click', () => {
        flipCard.classList.add('flipped');
    });
    
    return flipCard;
}

function animateCardsIn() {
    const cards = document.querySelectorAll('.flip-card');
    
    // Reset any existing transforms first
    gsap.set(cards, { clearProps: "all" });
    
    cards.forEach((card, index) => {
        // Set initial state
        gsap.set(card, {
            opacity: 0,
            y: 50,
            scale: 0.8
        });
        
        // Animate in
        gsap.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.2,
            ease: 'back.out(1.7)'
        });
        
        // Create scroll trigger only for entrance animation
        ScrollTrigger.create({
            trigger: card,
            start: 'top 85%',
            onEnter: () => {
                if (!card.classList.contains('flipped')) {
                    gsap.to(card, {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                }
            },
            once: true
        });
    });
}

function viewRecipe(recipeId) {
    window.location.href = `recipe-details.html?id=${recipeId}`;
}