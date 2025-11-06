const API_KEY = '3b77836e92364efdb0e13d5078cc7bdc';
const BASE_URL = 'https://api.spoonacular.com';

async function fetchRecipes(query = '', category = '', maxIngredients = null, offset = 0) {
    try {
        let url = `${BASE_URL}/recipes/complexSearch?apiKey=${API_KEY}&number=15&offset=${offset}&addRecipeInformation=true&fillIngredients=true`;

        url += '&excludeIngredients=alcohol,wine,beer,vodka,rum,whiskey,liqueur';
        
        if (query) {
            url += `&query=${encodeURIComponent(query)}`;
        }
        
        if (category && category !== 'all') {
            if (category === 'breakfast') {
                url += '&type=breakfast';
            } else if (category === 'snacks') {
                url += '&type=snack,appetizer';
            } else if (category === 'dessert') {
                url += '&type=dessert';
            }
        }
        
        if (maxIngredients) {
            url += `&maxReadyTime=60&number=15`;
        }

        const response = await fetch(url);
        const data = await response.json();
        
        let recipes = data.results || [];
        
        if (maxIngredients) {
            recipes = recipes.filter(recipe => {
                const ingredientCount = recipe.extendedIngredients ? recipe.extendedIngredients.length : 0;
                return ingredientCount <= maxIngredients;
            });
        }
        
        return {
            recipes: recipes,
            totalResults: data.totalResults || 0
        };
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return { recipes: [], totalResults: 0 };
    }
}

async function fetchRecipeDetails(recipeId) {
    try {
        const url = `${BASE_URL}/recipes/${recipeId}/information?apiKey=${API_KEY}&includeNutrition=true`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        return null;
    }
}

async function fetchRandomRecipes(count = 3) {
    try {
        const url = `${BASE_URL}/recipes/random?apiKey=${API_KEY}&number=${count}&tags=vegetarian,dessert,snack`;
        const response = await fetch(url);
        const data = await response.json();
        return data.recipes || [];
    } catch (error) {
        console.error('Error fetching random recipes:', error);
        return [];
    }
}

async function fetchPopularRecipes() {
    try {
        const url = `${BASE_URL}/recipes/complexSearch?apiKey=${API_KEY}&number=4&sort=popularity&addRecipeInformation=true`;
        const response = await fetch(url);
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Error fetching popular recipes:', error);
        return [];
    }
}