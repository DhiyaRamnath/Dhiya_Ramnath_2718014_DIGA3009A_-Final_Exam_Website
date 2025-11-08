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

console.log('API Key loaded:', API_KEY ? 'Yes' : 'No');
console.log('API Base URL:', API_BASE_URL);