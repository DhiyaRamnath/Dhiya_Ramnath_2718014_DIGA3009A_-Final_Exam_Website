const starColors = ['blue-star', 'green-star', 'orange-star', 'pink-star', 'yellow-star'];
const colors = ['color-teal', 'color-orange', 'color-pink'];
let currentRecipes = [];
let currentRecipeId = null;
let isFlipped = false;

const MOCK_RECIPES = [
    {
        id: 1,
        title: "Rainbow Fruit Kebabs",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
        readyInMinutes: 15,
        servings: 4,
        summary: "Colorful and healthy fruit skewers that kids love to make and eat! Perfect for parties or a fun snack."
    },
    {
        id: 2,
        title: "Chocolate Chip Cookies",
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400",
        readyInMinutes: 25,
        servings: 12,
        summary: "Classic homemade chocolate chip cookies that are soft, chewy, and absolutely delicious. A timeless treat!"
    },
    {
        id: 3,
        title: "Mini Pizza Bagels",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
        readyInMinutes: 20,
        servings: 6,
        summary: "Quick and easy mini pizzas made on bagels. Kids can customize with their favorite toppings!"
    },
    {
        id: 4,
        title: "Banana Pancakes",
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
        readyInMinutes: 20,
        servings: 4,
        summary: "Fluffy pancakes with sweet banana slices. A perfect breakfast treat that's fun to flip!"
    },
    {
        id: 5,
        title: "Veggie Sticks with Hummus",
        image: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400",
        readyInMinutes: 10,
        servings: 2,
        summary: "Crunchy vegetables served with creamy hummus. A healthy and colorful snack option!"
    },
    {
        id: 6,
        title: "Strawberry Smoothie Bowl",
        image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400",
        readyInMinutes: 10,
        servings: 2,
        summary: "A thick and creamy smoothie bowl topped with fresh fruits and granola. Fun to decorate!"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    initSpinningStars();
    initLetterHoverEffect();
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
    if (!container) return;
    
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
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        
        gsap.set(starEl, {
            x: startX,
            y: startY,
            rotation: Math.random() * 360
        });
        
        const timeline = gsap.timeline({ repeat: -1 });
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
        timeline.to(starEl, {
            x: startX,
            y: startY,
            rotation: '+=360',
            duration: 8 + Math.random() * 4,
            ease: 'sine.inOut'
        });
    }
}

function initRefreshButton() {
    const refreshBtn = document.getElementById('refresh-button');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            load3RandomRecipes();
        });
    }
}

function getRandomMockRecipes(count = 3) {
    const shuffled = [...MOCK_RECIPES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

async function load3RandomRecipes() {
    const cardsGrid = document.getElementById('cards-grid');
    cardsGrid.innerHTML = '<p class="loading-message">Loading mystery recipes...</p>';
    
    try {
        let recipes;
        if (typeof window.fetchRandomRecipes === 'function') {
            console.log('Attempting to fetch from API...');
            try {
                const response = await window.fetchRandomRecipes(3);
                console.log('API Response:', response);
                
                if (Array.isArray(response)) {
                    recipes = response;
                } else if (response && response.recipes && Array.isArray(response.recipes)) {
                    recipes = response.recipes;
                } else if (response && response.results && Array.isArray(response.results)) {
                    recipes = response.results;
                }
                
                if (recipes && recipes.length > 0) {
                    console.log('Successfully loaded recipes from API:', recipes.length);
                } else {
                    throw new Error('API returned no recipes');
                }
            } catch (apiError) {
                console.warn('API fetch failed, using fallback recipes:', apiError.message);
                recipes = getRandomMockRecipes(3);
                const notice = document.createElement('p');
                notice.style.cssText = 'text-align: center; color: var(--orange); font-family: Pangolin, cursive; font-size: 0.9rem; margin-bottom: 1rem;';
                notice.textContent = "Using demo recipes (API limit reached)";
                cardsGrid.parentElement.insertBefore(notice, cardsGrid);
                setTimeout(() => notice.remove(), 3000);
            }
        } else {
            console.log('API not available, using fallback recipes');
            recipes = getRandomMockRecipes(3);
        }
        
        if (!recipes || recipes.length === 0) {
            throw new Error('No recipes available');
        }
        
        console.log('Displaying recipes:', recipes.length);
        currentRecipes = recipes;
        displayFlipCards(recipes);
    } catch (error) {
        console.error('Error loading recipes:', error);
        cardsGrid.innerHTML = `
            <div class="loading-message" style="color: var(--pink);">
                Oops! Could not load recipes.<br>
                <small style="font-size: 0.8em; display: block; margin-top: 1rem;">
                    Error: ${error.message}<br>
                    Check the browser console for details.
                </small>
                <button onclick="load3RandomRecipes()" 
                        style="margin-top: 1rem; padding: 0.8rem 1.5rem; 
                               background: var(--teal); color: white; 
                               border: none; border-radius: 25px; 
                               font-family: 'Sniglet', cursive; 
                               cursor: pointer;">
                    Try Again
                </button>
            </div>
        `;
    }
}

function displayFlipCards(recipes) {
    const cardsGrid = document.getElementById('cards-grid');
    cardsGrid.innerHTML = '';
    cardsGrid.classList.remove('has-flipped-card');
    
    recipes.forEach((recipe, index) => {
        const card = createFlipCard(recipe, index);
        cardsGrid.appendChild(card);
    });
}

function createFlipCard(recipe, index) {
    const colorClass = colors[index % colors.length];
    
    const card = document.createElement('div');
    card.className = 'flip-card';
    card.setAttribute('data-recipe-id', recipe.id);
    
    const cardInner = document.createElement('div');
    cardInner.className = 'flip-card-inner';

    const cardFront = document.createElement('div');
    cardFront.className = `flip-card-front ${colorClass}`;
    
    const logo = document.createElement('img');
    logo.src = 'assets/iwe-logo.png';
    logo.alt = 'Incy Wincy Eats';
    logo.className = 'card-logo';
    logo.onerror = () => {
        logo.style.display = 'none';
    };
    
    const message = document.createElement('p');
    message.className = 'card-message';
    message.textContent = 'Click to Reveal!';
    
    const emoji = document.createElement('div');
    
    cardFront.appendChild(logo);
    cardFront.appendChild(message);
    
    const cardBack = document.createElement('div');
    cardBack.className = 'flip-card-back';
    
    const recipeImage = document.createElement('img');
    recipeImage.src = recipe.image || 'assets/placeholder.jpg';
    recipeImage.alt = recipe.title;
    recipeImage.className = 'recipe-image-large';
    recipeImage.onerror = () => {
        recipeImage.src = 'assets/placeholder.jpg';
    };
    
    const recipeDetails = document.createElement('div');
    recipeDetails.className = 'recipe-details';
    
    const recipeTitle = document.createElement('h3');
    recipeTitle.className = 'recipe-title-large';
    recipeTitle.textContent = recipe.title;
    
    const recipeMeta = document.createElement('div');
    recipeMeta.className = 'recipe-meta';
    recipeMeta.innerHTML = `
        <span class="meta-item">${recipe.readyInMinutes || 'N/A'} mins</span>
        <span class="meta-item">${recipe.servings || 'N/A'} servings</span>
    `;
    
    const recipeSummary = document.createElement('div');
    recipeSummary.className = 'recipe-summary';
        if (recipe.summary) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = recipe.summary;
            const summaryText = tempDiv.textContent || tempDiv.innerText;
            recipeSummary.textContent = summaryText.substring(0, 200) + '...';
    }   
        else {
            recipeSummary.textContent = 'Click below to see the full recipe!';
    }
    
    const recipeActions = document.createElement('div');
    recipeActions.className = 'recipe-actions';
    
    const viewBtn = document.createElement('button');
    viewBtn.className = 'view-full-btn';
    viewBtn.textContent = 'View Full Recipe';
    viewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.location.href = `recipe.html?id=${recipe.id}`;
    });
    
    recipeActions.appendChild(viewBtn);
    
    recipeDetails.appendChild(recipeTitle);
    recipeDetails.appendChild(recipeMeta);
    recipeDetails.appendChild(recipeSummary);
    recipeDetails.appendChild(recipeActions);
    
    cardBack.appendChild(recipeImage);
    cardBack.appendChild(recipeDetails);
    
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    
    card.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-full-btn')) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        
        const scrollY = window.scrollY;
        
        const cardsGrid = document.getElementById('cards-grid');
        const allCards = document.querySelectorAll('.flip-card');
        
        if (!card.classList.contains('flipped')) {
            card.classList.add('flipped');
            cardsGrid.classList.add('has-flipped-card');
            allCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('flipped');
                }
            });
        } else {
            card.classList.remove('flipped');
            cardsGrid.classList.remove('has-flipped-card');
        }
        
        requestAnimationFrame(() => {
            window.scrollTo(0, scrollY);
        });
    });
    
    return card;
}

window.load3RandomRecipes = load3RandomRecipes;