import axios from 'axios';
import { API_BASE_URL } from './config.js';

const backendUrl = API_BASE_URL;


export const login = async (staff_name, password) => {
  try {
    console.log(' Starting login process...');
    
    const response = await axios.post(`${backendUrl}/api/auth/login`, {
      staff_name,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    console.log('📡 Login response received');

    const { token, role } = response.data;
    
    if (!token || !role) {
      throw new Error('Invalid server response: missing token or role');
    }
    
    console.log('✅ Login successful');
    
    // Store authentication data
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('staff_name', staff_name);
    localStorage.setItem('staff_id', staff_id);
    
    // Store user object for admin dashboard
    localStorage.setItem('user', JSON.stringify({
      id: staff_id,
      staff_name: staff_name,
      role: role,
    }));
    
    console.log('💾 User data stored successfully');
    
    return { token, role, id, staff_name };
  } catch (error) {
    console.error('❌ Login error:', error);
    throw error;
  }
};

/**
 * 👤 User signup function
 * @param {object} formData - User registration data
 * @returns {Promise<object>} Signup response
 */
export const signup = async (formData) => {
  try {
    const response = await axios.post(`${backendUrl}/api/auth/signup`, formData, {
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

/**
 * 🔍 Get current logged-in user
 * @returns {object|null} User object or null if not found
 */
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    console.log('🔍 Getting current user:', user?.name || 'Not found');
    return user;
  } catch (error) {
    console.error('❌ Error parsing user data:', error);
    return null;
  }
};

export const logout = () => {
  console.log('🚪 Logging out...');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('staff_name');
  localStorage.removeItem('role');
  localStorage.removeItem('staff_id');
  localStorage.removeItem('_id');
  localStorage.removeItem('id');
  console.log('✅ Logout completed');
};
