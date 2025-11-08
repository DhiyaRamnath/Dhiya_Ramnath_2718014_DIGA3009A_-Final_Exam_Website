const API_KEY = 'b114ed15733944f891b04462f069d47f';
const API_BASE_URL = 'https://api.spoonacular.com';

function buildApiUrl(endpoint, params = {}) {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    url.searchParams.append('apiKey', API_KEY);
    
    Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
            url.searchParams.append(key, params[key]);
        }
    });
    
    return url.toString();
}

async function testApiConnection() {
    try {
        const response = await fetch(buildApiUrl('/recipes/random', { number: 1 }));
        if (response.ok) {
            console.log('API connection successful');
            return true;
        } else {
            console.error('API connection failed:', response.status);
            return false;
        }
    } catch (error) {
        console.error('API connection error:', error);
        return false;
    }
}

const ALCOHOL_KEYWORDS = [
    'wine', 'beer', 'vodka', 'rum', 'whiskey', 'whisky', 'bourbon', 
    'gin', 'tequila', 'brandy', 'liqueur', 'champagne', 'prosecco',
    'sake', 'cognac', 'amaretto', 'kahlua', 'baileys', 'schnapps',
    'martini', 'margarita', 'mojito', 'sangria', 'alcoholic', 'alcohol',
    'cocktail', 'spirits', 'liquor', 'sherry', 'port wine', 'vermouth'
];

function containsAlcohol(recipe) {
    const titleLower = recipe.title.toLowerCase();
    if (ALCOHOL_KEYWORDS.some(keyword => titleLower.includes(keyword))) {
        console.log(`Filtered out recipe (title): ${recipe.title}`);
        return true;
    }
    if (recipe.extendedIngredients && Array.isArray(recipe.extendedIngredients)) {
        for (const ingredient of recipe.extendedIngredients) {
            const ingredientName = ingredient.name.toLowerCase();
            const ingredientOriginal = ingredient.original.toLowerCase();
            
            if (ALCOHOL_KEYWORDS.some(keyword => 
                ingredientName.includes(keyword) || ingredientOriginal.includes(keyword)
            )) {
                console.log(`Filtered out recipe (ingredients): ${recipe.title}`);
                return true;
            }
        }
    }
    
    return false;
}

function filterAlcoholRecipes(recipes) {
    return recipes.filter(recipe => !containsAlcohol(recipe));
}

async function fetchRandomRecipes(number = 3) {
    try {
        const requestNumber = number * 3;
        
        const url = buildApiUrl('/recipes/random', { 
            number: requestNumber,
            tags: 'easy',
            excludeIngredients: 'alcohol,wine,beer,liquor'
        });
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Fetched recipes before filtering:', data.recipes?.length);
        let filteredRecipes = filterAlcoholRecipes(data.recipes || []);
        console.log('Recipes after alcohol filtering:', filteredRecipes.length);
        return filteredRecipes.slice(0, number);
    } catch (error) {
        console.error('Error fetching random recipes:', error);
        throw error;
    }
}

async function fetchRecipeById(id) {
    try {
        const url = buildApiUrl(`/recipes/${id}/information`, { 
            includeNutrition: true 
        });
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        const recipe = await response.json()

        if (containsAlcohol(recipe)) {
            console.warn('Recipe contains alcohol:', recipe.title);
        }
        
        console.log('Fetched recipe by ID:', recipe);
        return recipe;
    } catch (error) {
        console.error('Error fetching recipe by ID:', error);
        throw error;
    }
}

async function searchRecipes(query, number = 12) {
    try {
        const requestNumber = number * 2;
        
        const url = buildApiUrl('/recipes/complexSearch', {
            query: query,
            number: requestNumber,
            addRecipeInformation: true,
            fillIngredients: true,
            excludeIngredients: 'alcohol,wine,beer,liquor'
        });
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Search results before filtering:', data.results?.length);
        let filteredRecipes = filterAlcoholRecipes(data.results || []);
        console.log('Search results after alcohol filtering:', filteredRecipes.length);
        return filteredRecipes.slice(0, number);
    } catch (error) {
        console.error('Error searching recipes:', error);
        throw error;
    }
}

async function fetchRecipesByCategory(category, number = 12) {
    try {
        const requestNumber = number * 2;
        const url = buildApiUrl('/recipes/complexSearch', {
            type: category,
            number: requestNumber,
            addRecipeInformation: true,
            excludeIngredients: 'alcohol,wine,beer,liquor'
        });
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`Fetched ${category} recipes before filtering:`, data.results?.length);
        let filteredRecipes = filterAlcoholRecipes(data.results || []);
        console.log(`${category} recipes after alcohol filtering:`, filteredRecipes.length);
        return filteredRecipes.slice(0, number);
    } catch (error) {
        console.error(`Error fetching ${category} recipes:`, error);
        throw error;
    }
}
window.fetchRandomRecipes = fetchRandomRecipes;
window.fetchRecipeById = fetchRecipeById;
window.searchRecipes = searchRecipes;
window.fetchRecipesByCategory = fetchRecipesByCategory;
window.buildApiUrl = buildApiUrl;
window.testApiConnection = testApiConnection;

console.log('API Key loaded:', API_KEY ? 'Yes' : 'No');
console.log('API Base URL:', API_BASE_URL);
console.log('API functions initialized with kid-friendly alcohol filtering');