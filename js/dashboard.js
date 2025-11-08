let currentUser = null;

const emailDomains = [
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'hotmail.com',
    'icloud.com',
    'aol.com',
    'protonmail.com',
    'zoho.com'
];

document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    initLoginForm();
    initEmailSuggestions();
    initLogout();
});

function initLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to log out?')) {
                logout();
            }
        });
    }
}

function logout() {
    localStorage.removeItem('userProfile');
    currentUser = null;
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('profile-section').style.display = 'none';
    document.getElementById('recommended-section').style.display = 'none';
    document.getElementById('favorites-section').style.display = 'none';
    showNotification('Logged out successfully!');
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

function initLoginForm() {
    const form = document.getElementById('login-form');
    const nameInput = document.getElementById('user-name');
    const ageInput = document.getElementById('user-age');
    const emailInput = document.getElementById('user-email');
    const passwordInput = document.getElementById('user-password');
    const passwordConfirmInput = document.getElementById('user-password-confirm');
    const categorySelect = document.getElementById('user-category');
    
    nameInput.addEventListener('blur', () => validateName());
    emailInput.addEventListener('blur', () => validateEmail());
    passwordInput.addEventListener('blur', () => validatePassword());
    passwordConfirmInput.addEventListener('blur', () => validatePasswordMatch());
    categorySelect.addEventListener('change', () => validateCategory());
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isPasswordMatch = validatePasswordMatch();
        const isCategoryValid = validateCategory();
        
        if (isNameValid && isEmailValid && isPasswordValid && isPasswordMatch && isCategoryValid) {
            saveUserProfile();
        }
    });
}

function initEmailSuggestions() {
    const emailInput = document.getElementById('user-email');
    const suggestionsDiv = document.getElementById('email-suggestions');
    
    emailInput.addEventListener('input', () => {
        const value = emailInput.value;
        const atIndex = value.indexOf('@');
        
        if (atIndex > 0) {
            const username = value.substring(0, atIndex);
            const domain = value.substring(atIndex + 1);
            
            const matchingDomains = emailDomains.filter(d => 
                d.toLowerCase().startsWith(domain.toLowerCase())
            );
            
            if (matchingDomains.length > 0 && domain !== '') {
                showEmailSuggestions(username, matchingDomains, domain);
            } else {
                suggestionsDiv.classList.remove('show');
            }
        } else {
            suggestionsDiv.classList.remove('show');
        }
    });
    
    document.addEventListener('click', (e) => {
        if (!emailInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
            suggestionsDiv.classList.remove('show');
        }
    });
}

function showEmailSuggestions(username, domains, typedDomain) {
    const suggestionsDiv = document.getElementById('email-suggestions');
    suggestionsDiv.innerHTML = '';
    
    domains.forEach(domain => {
        const item = document.createElement('div');
        item.className = 'email-suggestion-item';
        
        const highlightedDomain = domain.replace(
            new RegExp(`^${typedDomain}`, 'i'),
            `<span class="suggestion-highlight">${typedDomain}</span>`
        );
        
        item.innerHTML = `${username}@${highlightedDomain}`;
        
        item.addEventListener('click', () => {
            document.getElementById('user-email').value = `${username}@${domain}`;
            suggestionsDiv.classList.remove('show');
            validateEmail();
        });
        
        suggestionsDiv.appendChild(item);
    });
    
    suggestionsDiv.classList.add('show');
}

function validateName() {
    const nameInput = document.getElementById('user-name');
    const errorMsg = document.getElementById('name-error');
    const name = nameInput.value.trim();
    
    if (name.length < 3) {
        nameInput.classList.add('error');
        nameInput.classList.remove('success');
        errorMsg.classList.add('show');
        return false;
    } else {
        nameInput.classList.remove('error');
        nameInput.classList.add('success');
        errorMsg.classList.remove('show');
        return true;
    }
}

function validateEmail() {
    const emailInput = document.getElementById('user-email');
    const errorMsg = document.getElementById('email-error');
    const email = emailInput.value.trim();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        emailInput.classList.add('error');
        emailInput.classList.remove('success');
        errorMsg.classList.add('show');
        return false;
    } else {
        emailInput.classList.remove('error');
        emailInput.classList.add('success');
        errorMsg.classList.remove('show');
        return true;
    }
}

function validatePassword() {
    const passwordInput = document.getElementById('user-password');
    const errorMsg = document.getElementById('password-error');
    const password = passwordInput.value;
    
    if (password.length === 0) {
        passwordInput.classList.add('error');
        passwordInput.classList.remove('success');
        errorMsg.classList.add('show');
        return false;
    } else {
        passwordInput.classList.remove('error');
        passwordInput.classList.add('success');
        errorMsg.classList.remove('show');
        return true;
    }
}

function validatePasswordMatch() {
    const passwordInput = document.getElementById('user-password');
    const passwordConfirmInput = document.getElementById('user-password-confirm');
    const errorMsg = document.getElementById('password-confirm-error');
    
    if (passwordInput.value !== passwordConfirmInput.value) {
        passwordConfirmInput.classList.add('error');
        passwordConfirmInput.classList.remove('success');
        errorMsg.classList.add('show');
        return false;
    } else {
        passwordConfirmInput.classList.remove('error');
        passwordConfirmInput.classList.add('success');
        errorMsg.classList.remove('show');
        return true;
    }
}

function validateCategory() {
    const categorySelect = document.getElementById('user-category');
    const errorMsg = document.getElementById('category-error');
    
    if (categorySelect.value === '') {
        categorySelect.classList.add('error');
        errorMsg.classList.add('show');
        return false;
    } else {
        categorySelect.classList.remove('error');
        errorMsg.classList.remove('show');
        return true;
    }
}

function saveUserProfile() {
    const name = document.getElementById('user-name').value.trim();
    const age = document.getElementById('user-age').value;
    const email = document.getElementById('user-email').value.trim();
    const category = document.getElementById('user-category').value;
    
    const userData = {
        name: name,
        age: age,
        email: email,
        category: category,
        favorites: JSON.parse(localStorage.getItem('favoriteRecipes')) || []
    };
    
    localStorage.setItem('userProfile', JSON.stringify(userData));
    currentUser = userData;
    
    displayUserProfile();
    loadRecommendedRecipes();
}

function loadUserProfile() {
    const userProfile = localStorage.getItem('userProfile');
    
    if (userProfile) {
        currentUser = JSON.parse(userProfile);
        displayUserProfile();
        loadRecommendedRecipes();
    }
}

function displayUserProfile() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('profile-section').style.display = 'flex';
    document.getElementById('recommended-section').style.display = 'block';
    document.getElementById('favorites-section').style.display = 'block';
    
    const greeting = document.getElementById('user-greeting');
    greeting.textContent = `HELLO, ${currentUser.name.toUpperCase()}!`;
    
    loadFavoriteRecipes();
}

async function loadRecommendedRecipes() {
    const grid = document.getElementById('recommended-grid');
    const subtitle = document.getElementById('recommended-subtitle');
    
    if (!currentUser) return;
    
    const categoryNames = {
        'dessert': 'Desserts',
        'appetizer': 'Small Snacks',
        'breakfast': 'Breakfast',
        'lunch': 'Lunch',
        'dinner': 'Dinner'
    };
    
    subtitle.textContent = `Based on your love for ${categoryNames[currentUser.category]}!`;
    
    try {
        grid.innerHTML = '<p class="loading-message">Loading your personalized recommendations...</p>';
        
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&type=${currentUser.category}&number=5&addRecipeInformation=true&sort=random`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch recipes');
        }
        
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            displayRecommendedRecipes(data.results);
        } else {
            grid.innerHTML = '<p class="empty-message">No recommendations found. Try browsing recipes!</p>';
        }
    } catch (error) {
        console.error('Error loading recommended recipes:', error);
        grid.innerHTML = '<p class="empty-message">Unable to load recommendations. Please try again later.</p>';
    }
}

function displayRecommendedRecipes(recipes) {
    const grid = document.getElementById('recommended-grid');
    grid.innerHTML = '';
    
    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        
        const isFavorite = isRecipeFavorite(recipe.id);
        
        card.innerHTML = `
            <img src="${recipe.image || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${recipe.title}" class="recipe-image">
            <div class="recipe-info">
                <h3 class="recipe-name">${recipe.title}</h3>
                <p class="recipe-time">${recipe.readyInMinutes || 30} mins</p>
                <div class="card-actions">
                    <button class="view-btn" onclick="window.location.href='recipe-details.html?id=${recipe.id}'">View Recipe</button>
                    <button class="remove-btn" onclick="toggleFavorite(${recipe.id}, '${recipe.title.replace(/'/g, "\\'")}', '${recipe.image}', ${recipe.readyInMinutes || 30})">
                        ${isFavorite ? '❤️ Remove' : '♥ Favorite'}
                    </button>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function loadFavoriteRecipes() {
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    const grid = document.getElementById('favorites-grid');
    
    if (favorites.length === 0) {
        grid.innerHTML = '<p class="empty-message">No favorite recipes yet. Start exploring!</p>';
        return;
    }
    
    grid.innerHTML = '';
    
    favorites.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        
        card.innerHTML = `
            <img src="${recipe.image || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${recipe.title}" class="recipe-image">
            <div class="recipe-info">
                <h3 class="recipe-name">${recipe.title}</h3>
                <p class="recipe-time">${recipe.readyInMinutes || 30} mins</p>
                <div class="card-actions">
                    <button class="view-btn" onclick="window.location.href='recipe-details.html?id=${recipe.id}'">View Recipe</button>
                    <button class="remove-btn" onclick="removeFavorite(${recipe.id})">❌ Remove</button>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function isRecipeFavorite(recipeId) {
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    return favorites.some(fav => fav.id === recipeId);
}

function toggleFavorite(recipeId, title, image, time) {
    let favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    const existingIndex = favorites.findIndex(fav => fav.id === recipeId);
    
    if (existingIndex > -1) {
        favorites.splice(existingIndex, 1);
    } else {
        favorites.push({
            id: recipeId,
            title: title,
            image: image,
            readyInMinutes: time
        });
    }
    
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
    
    if (currentUser) {
        currentUser.favorites = favorites;
        localStorage.setItem('userProfile', JSON.stringify(currentUser));
    }
    
    loadRecommendedRecipes();
    loadFavoriteRecipes();
}

function removeFavorite(recipeId) {
    let favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    favorites = favorites.filter(fav => fav.id !== recipeId);
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
    
    if (currentUser) {
        currentUser.favorites = favorites;
        localStorage.setItem('userProfile', JSON.stringify(currentUser));
    }
    
    loadFavoriteRecipes();
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