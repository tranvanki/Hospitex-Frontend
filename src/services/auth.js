import axios from 'axios';

const API_BASE_URL = 'https://twoserverweb2.onrender.com';
const TOKEN_KEY = 'token';
const USER_KEY = 'user';  // ✅ Store user info separately

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

    const { token, role, staff_id, staff_name: name } = response.data;
    
    // ✅ Store both token and user info
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify({
      id: staff_id,
      name: name,
      role: role,
      staff_name: staff_name
    }));
    
    console.log('Login successful:', { role, name, staff_id });
    
    return { token, role, staff_id, staff_name: name };
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

// ✅ Get current user info
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// ✅ Check if user is logged in
export const isAuthenticated = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const user = getCurrentUser();
  return !!(token && user);
};

// ✅ Get user role
export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || 'guest';
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
