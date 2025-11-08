let currentRecipe = null;
let recipeId = null;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    recipeId = urlParams.get('id');
    
    if (!recipeId) {
        showError();
        return;
    }
    
    loadRecipeDetails();
    initScrollAnimations();
});

async function loadRecipeDetails() {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}&includeNutrition=true`);
        if (!response.ok) {
            throw new Error('Recipe not found');
        }
        
        const recipe = await response.json();
        currentRecipe = recipe;
        loadingState.style.display = 'none';
        displayRecipe(recipe);
        initFavoriteButton();
        
    } catch (error) {
        console.error('Error loading recipe:', error);
        showError();
    }
}

function displayRecipe(recipe) {
    document.getElementById('recipe-header').style.display = 'block';
    document.getElementById('ingredients-section').style.display = 'block';
    document.getElementById('instructions-section').style.display = 'block';
    document.getElementById('nutrition-section').style.display = 'block';
    document.getElementById('recipe-image').src = recipe.image || 'https://via.placeholder.com/500x500?text=No+Image';
    document.getElementById('recipe-title').textContent = recipe.title;
    document.getElementById('recipe-time').textContent = `${recipe.readyInMinutes || 30} mins`;
    document.getElementById('recipe-servings').textContent = `${recipe.servings || 4} servings`;
    
    const summaryDiv = document.getElementById('recipe-summary');
    if (recipe.summary) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = recipe.summary;
        summaryDiv.innerHTML = `<p>${tempDiv.textContent || tempDiv.innerText}</p>`;
    } else {
        summaryDiv.innerHTML = '<p>A delicious recipe to try!</p>';
    }
    
    const ingredientsList = document.getElementById('ingredients-list');
    ingredientsList.innerHTML = '';
    
    if (recipe.extendedIngredients && recipe.extendedIngredients.length > 0) {
        recipe.extendedIngredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient.original;
            ingredientsList.appendChild(li);
        });
    } else {
        ingredientsList.innerHTML = '<li>No ingredients available</li>';
    }
    
    const instructionsList = document.getElementById('instructions-list');
    instructionsList.innerHTML = '';
    
    if (recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0 && recipe.analyzedInstructions[0].steps) {
        recipe.analyzedInstructions[0].steps.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step.step;
            instructionsList.appendChild(li);
        });
    } else if (recipe.instructions) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = recipe.instructions;
        const text = tempDiv.textContent || tempDiv.innerText;
        const steps = text.split(/\d+\.\s+/).filter(step => step.trim());
        
        if (steps.length > 0) {
            steps.forEach(step => {
                if (step.trim()) {
                    const li = document.createElement('li');
                    li.textContent = step.trim();
                    instructionsList.appendChild(li);
                }
            });
        } else {
            instructionsList.innerHTML = '<li>No instructions available</li>';
        }
    } else {
        instructionsList.innerHTML = '<li>No instructions available</li>';
    }
    
    const nutritionGrid = document.getElementById('nutrition-grid');
    nutritionGrid.innerHTML = '';
    
    if (recipe.nutrition && recipe.nutrition.nutrients) {
        const importantNutrients = ['Calories', 'Protein', 'Carbohydrates', 'Fat', 'Sugar', 'Sodium', 'Fiber', 'Cholesterol'];
        
        recipe.nutrition.nutrients.forEach(nutrient => {
            if (importantNutrients.includes(nutrient.name)) {
                const item = document.createElement('div');
                item.className = 'nutrition-item';
                item.innerHTML = `
                    <div class="nutrition-label">${nutrient.name}</div>
                    <div class="nutrition-value">${Math.round(nutrient.amount)}${nutrient.unit}</div>
                `;
                nutritionGrid.appendChild(item);
            }
        });
        
        if (nutritionGrid.children.length === 0) {
            nutritionGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: white; font-family: Pangolin, cursive;">Nutrition information not available</p>';
        }
    } else {
        nutritionGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: white; font-family: Pangolin, cursive;">Nutrition information not available</p>';
    }
}

function initFavoriteButton() {
    const favoriteBtn = document.getElementById('favorite-btn');
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    const isFavorited = favorites.some(fav => fav.id === parseInt(recipeId));
    
    if (isFavorited) {
        favoriteBtn.classList.add('favorited');
        favoriteBtn.querySelector('.favorite-text').textContent = 'Remove from Favorites';
    }
    
    favoriteBtn.addEventListener('click', toggleFavorite);
}

function toggleFavorite() {
    const favoriteBtn = document.getElementById('favorite-btn');
    let favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    
    const existingIndex = favorites.findIndex(fav => fav.id === parseInt(recipeId));
    
    if (existingIndex > -1) {
        favorites.splice(existingIndex, 1);
        favoriteBtn.classList.remove('favorited');
        favoriteBtn.querySelector('.favorite-text').textContent = 'Add to Favorites';
        showNotification('Removed from favorites!');
    } else {
        favorites.push({
            id: parseInt(recipeId),
            title: currentRecipe.title,
            image: currentRecipe.image,
            readyInMinutes: currentRecipe.readyInMinutes || 30
        });
        favoriteBtn.classList.add('favorited');
        favoriteBtn.querySelector('.favorite-text').textContent = 'Remove from Favorites';
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

function showError() {
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('error-state').style.display = 'block';
}

function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('.recipe-header', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        delay: 0.2
    });

    ScrollTrigger.create({
        trigger: '.ingredients-section',
        start: 'top 80%',
        onEnter: () => {
            gsap.to('.ingredients-section', {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: 'power2.out'
            });
    
            gsap.to('.ingredients-list li', {
                opacity: 1,
                x: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out'
            });
        }
    });
    
    gsap.set('.ingredients-list li', {
        opacity: 0,
        x: -30
    });
    
    ScrollTrigger.create({
        trigger: '.instructions-section',
        start: 'top 80%',
        onEnter: () => {
            gsap.to('.instructions-section', {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: 'power2.out'
            });
            gsap.to('.instructions-list li', {
                opacity: 1,
                x: 0,
                duration: 0.5,
                stagger: 0.15,
                ease: 'power2.out'
            });
        }
    });
    gsap.set('.instructions-list li', {
        opacity: 0,
        x: 30
    });
    
    ScrollTrigger.create({
        trigger: '.nutrition-section',
        start: 'top 80%',
        onEnter: () => {
            gsap.to('.nutrition-section', {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power2.out'
            });
            
            gsap.to('.nutrition-item', {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                stagger: 0.1,
                ease: 'back.out(1.7)'
            });
        }
    });
    
    gsap.set('.nutrition-item', {
        opacity: 0,
        y: 30,
        scale: 0.8
    });

    ScrollTrigger.create({
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
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