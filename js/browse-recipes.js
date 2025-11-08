let currentRecipes = [];
let activeFilters = {
    mealType: '',
    time: '',
    difficulty: '',
    ingredients: '',
    search: ''
};

let currentPage = 1;
let totalResults = 0;
const recipesPerPage = 12;

document.addEventListener('DOMContentLoaded', () => {
    initLetterHoverEffect();
    loadRecipes();
    loadPopularRecipes();
    initFilters();
    initPagination();
    initScrollAnimations();
    initCorianderAnimation();
});

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

function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);
}

function initLetterHoverEffect() {
    const pageTitle = document.getElementById('browse-title');
    if (pageTitle) {
        const text = pageTitle.textContent;
        pageTitle.innerHTML = '';
        
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.className = 'hover-letter';
            span.textContent = text[i];
            if (text[i] === ' ') {
                span.style.marginRight = '0.5rem';
            }
            pageTitle.appendChild(span);
        }
    }
}

async function loadRecipes() {
    const grid = document.getElementById('recipes-grid');
    grid.innerHTML = '<p class="loading-message">Loading delicious recipes...</p>';

    try {
        const offset = (currentPage - 1) * recipesPerPage;
        const params = {
            number: recipesPerPage,
            offset: offset,
            addRecipeInformation: true,
            fillIngredients: true
        };
        
        if (activeFilters.mealType) {
            params.type = activeFilters.mealType;
        }
        
        if (activeFilters.time) {
            params.maxReadyTime = activeFilters.time;
        }
        
        if (activeFilters.ingredients) {
            params.maxIngredients = activeFilters.ingredients;
        }
        
        if (activeFilters.search) {
            params.query = activeFilters.search;
        }

        const url = buildApiUrl('/recipes/complexSearch', params);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to fetch recipes');
        }

        const data = await response.json();
        let recipes = data.results || [];
        totalResults = data.totalResults || 0;

        console.log('Recipes before filtering:', recipes.length);
        if (activeFilters.difficulty) {
            recipes = filterByDifficulty(recipes, activeFilters.difficulty);
        }

        currentRecipes = recipes;

        if (currentRecipes.length === 0) {
            grid.innerHTML = '<p class="loading-message">No recipes found. Try different filters!</p>';
            document.getElementById('pagination-section').style.display = 'none';
            return;
        }

        displayRecipes(currentRecipes);
        updatePagination();
        updateActiveFilters();
        document.querySelector('.recipes-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
        console.error('Error loading recipes:', error);
        grid.innerHTML = '<p class="loading-message">Oops! Something went wrong. Please try again later.</p>';
        document.getElementById('pagination-section').style.display = 'none';
    }
}

function filterByDifficulty(recipes, difficulty) {
    return recipes.filter(recipe => {
        const steps = recipe.analyzedInstructions?.[0]?.steps?.length || 0;
        const time = recipe.readyInMinutes || 0;
        
        if (difficulty === 'easy') {
            return steps <= 5 || time <= 20;
        } else if (difficulty === 'medium') {
            return (steps > 5 && steps <= 10) || (time > 20 && time <= 45);
        } else if (difficulty === 'hard') {
            return steps > 10 || time > 45;
        }
        return true;
    });
}

function getDifficultyLevel(recipe) {
    const steps = recipe.analyzedInstructions?.[0]?.steps?.length || 0;
    const time = recipe.readyInMinutes || 0;
    
    if (steps <= 5 || time <= 20) {
        return 'easy';
    } else if ((steps > 5 && steps <= 10) || (time > 20 && time <= 45)) {
        return 'medium';
    } else {
        return 'hard';
    }
}

async function loadPopularRecipes() {
    const grid = document.getElementById('popular-grid');
    grid.innerHTML = '<p class="loading-message">Loading popular recipes...</p>';

    try {
        const url = buildApiUrl('/recipes/complexSearch', {
            number: 5,
            addRecipeInformation: true,
            sort: 'popularity',
            excludeIngredients: 'alcohol,wine,beer,liquor'
        });
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to fetch popular recipes');
        }

        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            displayPopularRecipes(data.results);
        } else {
            grid.innerHTML = '<p class="loading-message">No popular recipes available.</p>';
        }
    } catch (error) {
        console.error('Error loading popular recipes:', error);
        grid.innerHTML = '<p class="loading-message">Unable to load popular recipes.</p>';
    }
}

function displayRecipes(recipes) {
    const grid = document.getElementById('recipes-grid');
    grid.innerHTML = '';

    recipes.forEach(recipe => {
        const difficulty = getDifficultyLevel(recipe);
        const difficultyClass = `difficulty-${difficulty}`;
        
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.onclick = () => window.location.href = `recipe-details.html?id=${recipe.id}`;

        card.innerHTML = `
            <img src="${recipe.image || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${recipe.title}" class="recipe-image">
            <div class="recipe-info">
                <h3 class="recipe-name">${recipe.title}</h3>
                <p class="recipe-time">${recipe.readyInMinutes || 30} minutes</p>
                <p class="recipe-servings">${recipe.servings || 4} servings</p>
                <span class="recipe-difficulty ${difficultyClass}">${difficulty.toUpperCase()}</span>
            </div>
        `;

        grid.appendChild(card);
    });
}

function displayPopularRecipes(recipes) {
    const grid = document.getElementById('popular-grid');
    grid.innerHTML = '';
    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'popular-card';
        card.onclick = () => window.location.href = `recipe-details.html?id=${recipe.id}`;

        card.innerHTML = `
            <img src="${recipe.image || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${recipe.title}" class="recipe-image">
            <div class="recipe-info">
                <h3 class="recipe-name">${recipe.title}</h3>
            </div>
        `;
        grid.appendChild(card);
    });
}

function updatePagination() {
    const paginationSection = document.getElementById('pagination-section');
    const currentPageSpan = document.getElementById('current-page');
    const totalPagesSpan = document.getElementById('total-pages');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const totalPages = Math.ceil(totalResults / recipesPerPage);
    currentPageSpan.textContent = currentPage;
    totalPagesSpan.textContent = totalPages;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage >= totalPages;
    
    paginationSection.style.display = totalPages > 1 ? 'flex' : 'none';
}

function initPagination() {
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadRecipes();
        }
    });
    
    nextButton.addEventListener('click', () => {
        const totalPages = Math.ceil(totalResults / recipesPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            loadRecipes();
        }
    });
}

function updateActiveFilters() {
    const activeFiltersSection = document.getElementById('active-filters');
    const filterTags = document.getElementById('filter-tags');
    filterTags.innerHTML = '';
    
    let hasFilters = false;
    const filterLabels = {
        mealType: 'Meal Type',
        time: 'Time',
        difficulty: 'Difficulty',
        ingredients: 'Ingredients',
        search: 'Search'
    };
    
    const filterValues = {
        time: {
            '30': '30 min or less',
            '60': '1 hour or less'
        },
        ingredients: {
            '3': '3 ingredients or less',
            '5': '5 ingredients or less'
        }
    };
    
    for (const [key, value] of Object.entries(activeFilters)) {
        if (value) {
            hasFilters = true;
            const tag = document.createElement('div');
            tag.className = 'filter-tag';
            const displayValue = filterValues[key]?.[value] || value;
            tag.innerHTML = `
                <span>${filterLabels[key]}: ${displayValue}</span>
                <span class="remove" data-filter="${key}">✕</span>
            `;
            
            filterTags.appendChild(tag);
        }
    }
    
    activeFiltersSection.style.display = hasFilters ? 'block' : 'none';
    document.querySelectorAll('.filter-tag .remove').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const filterKey = button.getAttribute('data-filter');
            removeFilter(filterKey);
        });
    });
}

function removeFilter(filterKey) {
    activeFilters[filterKey] = '';
    const elementMap = {
        mealType: 'meal-type-filter',
        time: 'time-filter',
        difficulty: 'difficulty-filter',
        ingredients: 'ingredients-filter',
        search: 'search-input'
    };
    
    const element = document.getElementById(elementMap[filterKey]);
    if (element) {
        element.value = '';
    }
    
    currentPage = 1;
    loadRecipes();
}

function initFilters() {
    const applyButton = document.getElementById('apply-filters');
    const resetButton = document.getElementById('reset-filters');
    const mealTypeFilter = document.getElementById('meal-type-filter');
    const timeFilter = document.getElementById('time-filter');
    const difficultyFilter = document.getElementById('difficulty-filter');
    const ingredientsFilter = document.getElementById('ingredients-filter');
    const searchInput = document.getElementById('search-input');

    applyButton.addEventListener('click', () => {
        activeFilters.mealType = mealTypeFilter.value;
        activeFilters.time = timeFilter.value;
        activeFilters.difficulty = difficultyFilter.value;
        activeFilters.ingredients = ingredientsFilter.value;
        activeFilters.search = searchInput.value.trim();
        currentPage = 1;
        loadRecipes();
    });

    resetButton.addEventListener('click', () => {
        mealTypeFilter.value = '';
        timeFilter.value = '';
        difficultyFilter.value = '';
        ingredientsFilter.value = '';
        searchInput.value = '';
        
        activeFilters = {
            mealType: '',
            time: '',
            difficulty: '',
            ingredients: '',
            search: ''
        };
        
        currentPage = 1;
        loadRecipes();
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            applyButton.click();
        }
    });
}