let currentRecipeId = null;
let isFlipped = false;

document.addEventListener('DOMContentLoaded', () => {
    initSurpriseButton();
});

function initSurpriseButton() {
    const surpriseButton = document.getElementById('surprise-button');
    const tryAgainButton = document.getElementById('try-again');

    surpriseButton.addEventListener('click', () => {
        loadRandomRecipe();
    });

    if (tryAgainButton) {
        tryAgainButton.addEventListener('click', () => {
            resetCard();
            loadRandomRecipe();
        });
    }
}

function resetCard() {
    const flipCard = document.getElementById('flip-card');
    const recipeDisplay = document.getElementById('recipe-display');
    
    flipCard.classList.remove('flipped');
    isFlipped = false;
    
    // Small delay before hiding to allow flip animation
    setTimeout(() => {
        recipeDisplay.style.display = 'none';
    }, 400);
}

async function loadRandomRecipe() {
    const surpriseButton = document.getElementById('surprise-button');
    surpriseButton.disabled = true;
    surpriseButton.textContent = '🎲 Loading...';

    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=1`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch recipe');
        }

        const data = await response.json();
        
        if (data.recipes && data.recipes.length > 0) {
            displayRecipe(data.recipes[0]);
        } else {
            alert('No recipe found. Please try again!');
        }
    } catch (error) {
        console.error('Error loading random recipe:', error);
        alert('Oops! Something went wrong. Please try again!');
    } finally {
        surpriseButton.disabled = false;
        surpriseButton.textContent = '🎲 Get Random Recipe';
    }
}

function displayRecipe(recipe) {
    currentRecipeId = recipe.id;
    
    // Update back of card with recipe info
    document.getElementById('recipe-image').src = recipe.image || 'https://via.placeholder.com/900x400?text=No+Image';
    document.getElementById('recipe-title').textContent = recipe.title;
    document.getElementById('recipe-time').textContent = `${recipe.readyInMinutes || 30} minutes`;
    document.getElementById('recipe-servings').textContent = recipe.servings || 4;
    
    // Extract and clean summary
    let summary = 'A delicious recipe waiting for you to try!';
    if (recipe.summary) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = recipe.summary;
        const text = tempDiv.textContent || tempDiv.innerText;
        const sentences = text.split('.').slice(0, 3);
        summary = sentences.join('.') + '.';
    }
    document.getElementById('recipe-summary').textContent = summary;
    
    // Set random color for front of card
    const colors = ['color-teal', 'color-orange', 'color-pink'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const cardFront = document.querySelector('.flip-card-front');
    
    // Remove all color classes and add new one
    cardFront.classList.remove('color-teal', 'color-orange', 'color-pink');
    cardFront.classList.add(randomColor);
    
    // Show the card
    const recipeDisplay = document.getElementById('recipe-display');
    const flipCard = document.getElementById('flip-card');
    
    recipeDisplay.style.display = 'block';
    flipCard.classList.remove('flipped');
    isFlipped = false;
    
    // Set up flip on click
    setupFlipCard();
    
    // Set up view full recipe button
    const viewFullButton = document.getElementById('view-full-recipe');
    viewFullButton.onclick = () => {
        window.location.href = `recipe-details.html?id=${currentRecipeId}`;
    };
}

function setupFlipCard() {
    const flipCard = document.getElementById('flip-card');
    const cardFront = document.querySelector('.flip-card-front');
    
    // Remove old event listener by cloning
    const newCardFront = cardFront.cloneNode(true);
    cardFront.parentNode.replaceChild(newCardFront, cardFront);
    
    // Add new event listener
    newCardFront.addEventListener('click', () => {
        if (!isFlipped) {
            flipCard.classList.add('flipped');
            isFlipped = true;
        }
    });
}