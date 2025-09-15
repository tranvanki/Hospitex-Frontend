export const getApiBaseUrl = () => {
    if(import.meta.env.PROD){
        return import.meta.env.VITE_API_BASE_URL || 'https://hospitex-backend-8.onrender.com';
    }
    return 'http://localhost:10000';
};
export const API_BASE_URL = getApiBaseUrl();