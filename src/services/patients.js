import axios from 'axios';

const backendUrl = 'http://localhost:3001';
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
export const updatePatientById = async (id, patientData) => {
  try {
    const response = await axios.put(`${backendUrl}/patients/${id}`, patientData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Update patient error:', error);
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

export const totalPatients = async () => {
  try {
    const res = await axios.get(`${backendUrl}/patients/total`, { headers: getAuthHeaders() });
    
    // Use the correct property name from your backend
    return res.data.totalPatient ;  // Handle both cases
  } catch (error) {
    console.error('Error fetching total patients:', error);
    throw error;
  }
};