import axios from 'axios';
const backendUrl = 'http://localhost:3001';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const login = async (staff_name, password) => {
  const response = await axios.post(`${backendUrl}/login`, { staff_name, password });
   const { token, role } = response.data; // ✅ Destructure from response
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  localStorage.setItem('staff_name', staff_name);
  return { token, role, staff_name };
};

export const getAdminData = async () => {
  return axios.get(`${backendUrl}/admin-data`, { headers: getAuthHeaders() });
};

export const getDoctorData = async () => {
  return axios.get(`${backendUrl}/doctor-data`, { headers: getAuthHeaders() });
};

export const getStaffData = async () => {
  return axios.get(`${backendUrl}/staff-data`, { headers: getAuthHeaders() });
};
