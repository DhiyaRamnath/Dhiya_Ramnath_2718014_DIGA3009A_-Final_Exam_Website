let currentRecipe = null;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    
    if (recipeId) {
        loadRecipeDetails(recipeId);
    } else {
        document.querySelector('.recipe-details-container').innerHTML = '<p class="loading-message">No recipe selected. Please go back and choose a recipe.</p>';
    }
});

async function loadRecipeDetails(recipeId) {
    const container = document.querySelector('.recipe-details-container');
    container.innerHTML = '<p class="loading-message">Loading recipe details...</p>';

    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}&includeNutrition=true`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch recipe details');
        }

        const recipe = await response.json();
        currentRecipe = recipe;
        displayRecipeDetails(recipe);
        updateFavoriteButton();
    } catch (error) {
        console.error('Error loading recipe details:', error);
        container.innerHTML = '<p class="loading-message">Oops! Could not load recipe details. Please try again later.</p>';
    }
}

function displayRecipeDetails(recipe) {
    const container = document.querySelector('.recipe-details-container');
    
    // Extract summary without HTML tags
    let summary = 'A delicious recipe for you to try!';
    if (recipe.summary) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = recipe.summary;
        summary = tempDiv.textContent || tempDiv.innerText;
    }
    
    // Build ingredients list
    let ingredientsHTML = '<ul class="ingredients-list">';
    if (recipe.extendedIngredients && recipe.extendedIngredients.length > 0) {
        recipe.extendedIngredients.forEach(ingredient => {
            ingredientsHTML += `<li>${ingredient.original}</li>`;
        });
    } else {
        ingredientsHTML += '<li>No ingredients available</li>';
    }
    ingredientsHTML += '</ul>';
    
    // Build instructions list
    let instructionsHTML = '<ol class="instructions-list">';
    if (recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0 && recipe.analyzedInstructions[0].steps) {
        recipe.analyzedInstructions[0].steps.forEach(step => {
            instructionsHTML += `<li>${step.step}</li>`;
        });
    } else if (recipe.instructions) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = recipe.instructions;
        const text = tempDiv.textContent || tempDiv.innerText;
        const steps = text.split(/\d+\.|Step \d+/).filter(step => step.trim());
        steps.forEach(step => {
            if (step.trim()) {
                instructionsHTML += `<li>${step.trim()}</li>`;
            }
        });
    } else {
        instructionsHTML += '<li>No instructions available</li>';
    }
    instructionsHTML += '</ol>';
    
    // Build nutrition info
    let nutritionHTML = '';
    if (recipe.nutrition && recipe.nutrition.nutrients) {
        const keyNutrients = ['Calories', 'Protein', 'Fat', 'Carbohydrates', 'Sugar', 'Fiber'];
        nutritionHTML = '<div class="nutrition-grid">';
        
        recipe.nutrition.nutrients.forEach(nutrient => {
            if (keyNutrients.includes(nutrient.name)) {
                nutritionHTML += `
                    <div class="nutrition-item">
                        <div class="nutrition-label">${nutrient.name}</div>
                        <div class="nutrition-value">${Math.round(nutrient.amount)}${nutrient.unit}</div>
                    </div>
                `;
            }
        });
        
        nutritionHTML += '</div>';
    } else {
        nutritionHTML = '<p style="text-align: center;">Nutrition information not available</p>';
    }
    
    container.innerHTML = `
        <div class="recipe-header">
            <h1 class="recipe-title">${recipe.title}</h1>
            <div class="recipe-meta">
                <span>⏱️ ${recipe.readyInMinutes || 30} minutes</span>
                <span>🍽️ ${recipe.servings || 4} servings</span>
                <span>❤️ ${recipe.aggregateLikes || 0} likes</span>
            </div>
        </div>

        <div class="recipe-main">
            <div class="recipe-image-section">
                <img src="${recipe.image || 'https://via.placeholder.com/600x400?text=No+Image'}" alt="${recipe.title}" class="recipe-image-large">
                <button class="favorite-button" id="favorite-btn" title="Add to Favorites">♡</button>
            </div>

            <div class="recipe-info-section">
                <h2 class="section-title">About This Recipe</h2>
                <p class="recipe-summary">${summary}</p>
                
                <h2 class="section-title">Ingredients</h2>
                ${ingredientsHTML}
            </div>
        </div>

        <div class="instructions-section">
            <h2 class="section-title">Instructions</h2>
            ${instructionsHTML}
        </div>

        <div class="nutrition-section">
            <h2 class="section-title">Nutrition Information</h2>
            ${nutritionHTML}
        </div>

        <div class="action-buttons">
            <button class="action-btn" id="add-to-favorites-bottom">Add to Favorites</button>
            <button class="action-btn secondary" onclick="window.history.back()">Back to Recipes</button>
        </div>
    `;
    
    // Add event listeners for favorite buttons
    document.getElementById('favorite-btn').addEventListener('click', toggleFavorite);
    document.getElementById('add-to-favorites-bottom').addEventListener('click', toggleFavorite);
}

function updateFavoriteButton() {
    if (!currentRecipe) return;
    
    const favoriteBtn = document.getElementById('favorite-btn');
    const addToFavoritesBtn = document.getElementById('add-to-favorites-bottom');
    const isFavorite = isRecipeFavorite(currentRecipe.id);
    
    if (favoriteBtn) {
        favoriteBtn.textContent = isFavorite ? '❤️' : '♡';
        favoriteBtn.classList.toggle('favorited', isFavorite);
    }
    
    if (addToFavoritesBtn) {
        addToFavoritesBtn.textContent = isFavorite ? 'Remove from Favorites' : 'Add to Favorites';
    }
}

function isRecipeFavorite(recipeId) {
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    return favorites.some(fav => fav.id === recipeId);
}

function toggleFavorite() {
    if (!currentRecipe) return;
    
    let favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    const existingIndex = favorites.findIndex(fav => fav.id === currentRecipe.id);
    
    if (existingIndex > -1) {
        // Remove from favorites
        favorites.splice(existingIndex, 1);
        showNotification('Removed from favorites!');
    } else {
        // Add to favorites
        favorites.push({
            id: currentRecipe.id,
            title: currentRecipe.title,
            image: currentRecipe.image,
            readyInMinutes: currentRecipe.readyInMinutes || 30
        });
        showNotification('Added to favorites!');
    }
    
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
    
    // Update user profile if exists
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
        const user = JSON.parse(userProfile);
        user.favorites = favorites;
        localStorage.setItem('userProfile', JSON.stringify(user));
    }
    
    updateFavoriteButton();
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: var(--pink);
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
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add animation styles
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