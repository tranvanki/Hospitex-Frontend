import axios from 'axios';

const API_BASE_URL = 'https://twoserverweb2.onrender.com';
const TOKEN_KEY = 'token';

function getAuthHeaders() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { 
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  };
}

export const getAllStaff = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/staffs`, {
      headers: getAuthHeaders(),
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching staff list:', error);
    throw error;
  }
};

export const getStaffById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/staffs/${id}`, {
      headers: getAuthHeaders(),
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching staff with ID ${id}:`, error);
    throw error;
  }
};

export const createStaff = async (staffData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/staffs`, staffData, {
      headers: getAuthHeaders(),
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    console.error('Error creating staff:', error);
    throw error;
  }
};

export const updateStaff = async (id, staffData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/staffs/${id}`, staffData, {
      headers: getAuthHeaders(),
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    console.error('Error updating staff:', error);
    throw error;
  }
};

export const deleteStaff = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/staffs/${id}`, {
      headers: getAuthHeaders(),
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting staff:', error);
    throw error;
  }
};
