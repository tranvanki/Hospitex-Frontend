export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
    (import.meta.env.MODE === 'production' ? 
        'https://hospitex-backend-8.onrender.com' : 
        'http://localhost:10000');
