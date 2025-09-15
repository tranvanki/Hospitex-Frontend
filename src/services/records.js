// src/services/records.js
import axios from 'axios';

    const backendUrl = 'http://localhost:3001';


function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json'
} : {
      'Content-Type': 'application/json' 

};
}

// 📥 Get all medical records
export const getAllRecords = async () => {
  try {
    const response = await axios.get(`${backendUrl}/medic-records`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching medical records:', error);
    throw error;
  }
};
export const createMedicalRecord = async (recordData) => {
  //
  try{
    console.log('Using headers:', getAuthHeaders());
    const response = await axios.post(`${backendUrl}/medic-records`, recordData, {
      headers: getAuthHeaders()
    });
    return response.data;
  }catch(err){
    console.error('Error creating medical record:', err);
     console.error('Response status:', err.response?.status);
    console.error('Response data:', err.response?.data);
    throw err;
  }
}
//  Get record by ID
export const getRecordById = async (id) => {
  try {
    const response = await axios.get(`${backendUrl}/medic-records/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching record with ID ${id}:`, error);
    throw error;
  }
};

//  Add new medical record
export const addRecord = async (recordData) => {
  try {
    const response = await axios.post(`${backendUrl}/medic-records`, recordData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating new medical record:', error);
    throw error;
  }
};

//  Update record
export const updateRecord = async (id, recordData) => {
  try {
    const response = await axios.put(`${backendUrl}/medic-records/${id}`, recordData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating record with ID ${id}:`, error);
    throw error;
  }
};

//  Delete record
export const deleteRecord = async (id) => {
  try {
    await axios.delete(`${backendUrl}/medic-records/${id}`, {
      headers: getAuthHeaders()
    });
  } catch (error) {
    console.error(`Error deleting record with ID ${id}:`, error);
    throw error;
  }
};
//total medical records
export const totalMedicalRecords = async () => {
  try {
    const res = await axios.get(`${backendUrl}/medic-records/totalMedicalRecords`, { headers: getAuthHeaders() });
    return res.data.totalMedicRecord;
  } catch (error) {
    console.error('Error fetching total medical records:', error);
    throw error;
  }
};