import axios from 'axios';

const backendUrl = 'https://web2server-1.onrender.com';
//Get auth headers function
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Get all patients
export const getAllPatient = async () => {
  try {
    const res = await axios.get(`${backendUrl}/patients`, { headers: getAuthHeaders() });
    return res.data;
  } catch (error) {
    console.error('Error fetching patient list:', error);
    throw error;
  }
};
//Get my patients
export const getMyPatients = async () => {
  try {
    const res = await axios.get(`${backendUrl}/patients/my-patients`, { 
      headers: getAuthHeaders() 
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching my patients:', error);
    throw error;
  }
};
// Get patient by ID
export const getPatientById = async (id) => {
  try {
    const res = await axios.get(`${backendUrl}/patients/${id}`, { headers: getAuthHeaders() } );
    return res.data;
  } catch (error) {
    console.error(`Error fetching patient with ID ${id}:`, error);
    throw error;
  }
};

// Create new patient
export const createPatient = async (patientData) => {
  try {
    const res = await axios.post(`${backendUrl}/patients`, patientData, { headers: getAuthHeaders() } );
    return res.data;
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
};

// Update patient
export const updatePatient = async (id, patientData) => {
  try {
    const res = await axios.put(`${backendUrl}/patients/${id}`, patientData, { headers: getAuthHeaders() });
    return res.data;
  } catch (error) {
    console.error(`Error updating patient ID ${id}:`, error);
    throw error;
  }
};

// Delete patient
export const deletePatientById = async (id) => {
  try {
    await axios.delete(`${backendUrl}/patients/${id}`, { headers: getAuthHeaders() });
  } catch (error) {
    console.error(`Error deleting patient ID ${id}:`, error);
    throw error;
  }
};