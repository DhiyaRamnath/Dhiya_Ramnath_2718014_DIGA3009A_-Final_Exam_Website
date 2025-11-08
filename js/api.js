// Spoonacular API Key
// Get your free API key at: https://spoonacular.com/food-api/console#Dashboard
const API_KEY = '8ebf36c4c01c4b419aa8dfa5ca66e88f';

// API Configuration
const API_BASE_URL = 'https://api.spoonacular.com';

// Helper function to build API URLs
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

// Test API connection
async function testApiConnection() {
    try {
        const response = await fetch(buildApiUrl('/recipes/random', { number: 1 }));
        if (response.ok) {
            console.log('✅ API connection successful!');
            return true;
        } else {
            console.error('❌ API connection failed:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ API connection error:', error);
        return false;
    }
}

// Log API status on load
console.log('API Key loaded:', API_KEY ? 'Yes' : 'No');
console.log('API Base URL:', API_BASE_URL);