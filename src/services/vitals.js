// src/services/vitals.js
import axios from 'axios';

import { API_BASE_URL } from './config.js';

const backendUrl = API_BASE_URL;
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  };
}

// Create new vital for a patient
export const createVital = async (vitalData) => {
  try {
    console.log('Creating vital with data:', vitalData);
    
    // ✅ Data validation
    const requiredFields = ['patient_id', 'temperature', 'blood_pressure', 'pulse', 'resp_rate'];
    const missingFields = requiredFields.filter(field => !vitalData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    const response = await axios.post(`${backendUrl}/api/vitals`, vitalData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating vital:', error);
    throw error;
  }
};

//getAllVitals
export const getAllVitals = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/vitals`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all vitals:', error);
    throw error;
  }
};

// Get vitals for a specific patient
export const getVitalsByPatientId = async (patientId) => {
  try {
    const response = await axios.get(`${backendUrl}/api/vitals/patient/${patientId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching vitals for patient ${patientId}:`, error);
    throw error;  
  }
};
//update vital
export const updateVital = async (id, vitalData) => {
    try{
      const res = await axios.put(`${backendUrl}/api/vitals/${id}`, vitalData, {
        headers: getAuthHeaders()
      });
      return res.data;
    } catch (error) {
      console.error(`Error updating vital ${id}:`, error);
      throw error;    
    
    }
};

export const deleteVital = async (id) => {
  try {
    const res = await axios.delete(`${backendUrl}/api/vitals/${id}`, {
      headers: getAuthHeaders()
    });
    return res.data;
  } catch (error) {
    console.error(`Error deleting vital ${id}:`, error);
    throw error;
  }
};
export const totalVital = async () => {
  try {
    const res = await axios.get(`${backendUrl}/api/vitals/totalVitals`, { headers: getAuthHeaders() });
    return res.data.totalVital;
  } catch (error) {
    console.error('Error fetching total vitals:', error);
    throw error;
  }
};


