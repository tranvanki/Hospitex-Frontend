import axios from 'axios';

const API_BASE_URL = 'https://twoserverweb2.onrender.com';
const TOKEN_KEY = 'token';

export const login = async (staff_name, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      staff_name,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    const { token, role } = response.data;
    
    // Store token
    localStorage.setItem(TOKEN_KEY, token);
    
    return { token, role };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const signup = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signup`, formData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};
