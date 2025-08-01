<template>
  <div class="staff-container">
    <div class="staff-header">
      <div>
        <h1>👥 Staff Management</h1>
        <p>Manage hospital staff members and their roles</p>
      </div>
      <router-link to="/add-staff" class="btn btn-primary">
        ➕ Add New Staff
      </router-link>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading staff data...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <button @click="fetchStaffData" class="retry-btn">Try Again</button>
    </div>
    
    <!-- Staff Grid -->
    <div v-else class="staff-grid">
      <div v-for="staff in staffList" :key="staff._id" class="staff-card">
        <div class="staff-info">
          <div class="staff-avatar">
            {{ getInitials(staff.staff_name) }}
          </div>
          <div class="staff-details">
            <h4 class="staff-name">{{ staff.staff_name }}</h4>
            <p class="staff-email">{{ staff.email }}</p>
            <span class="role-badge" :class="getRoleBadgeClass(staff.role)">
              {{ staff.role }}
            </span>
          </div>
        </div>
        
        <div class="staff-stats">
          <div class="stat-item">
            <span class="stat-number">{{ staff.patientCount || 0 }}</span>
            <span class="stat-label">Patients</span>
          </div>
        </div>
        
        <div class="staff-actions">
          <button 
            class="action-btn delete" 
            @click="confirmDeleteStaff(staff)"
            :disabled="staff.role === 'admin' || (staff.role === 'doctor' && staff.patientCount > 0)"
          >
            Delete
          </button>
          <button class="action-btn edit">Edit</button>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-if="!loading && !error && staffList.length === 0" class="empty-state">
      <div class="empty-icon">👥</div>
      <h3>No Staff Members Found</h3>
      <p>There are no staff members in the system yet.</p>
      <router-link to="/add-staff" class="btn btn-primary">
        Add First Staff Member
      </router-link>
    </div>
    
    <!-- Stats Summary -->
    <div v-if="staffList.length > 0" class="stats-summary">
      <div class="stat-item">
        <span class="stat-number">{{ staffList.length }}</span>
        <span class="stat-label">Total Staff</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ getDoctorCount() }}</span>
        <span class="stat-label">Doctors</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ getNurseCount() }}</span>
        <span class="stat-label">Nurses</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ getAdminCount() }}</span>
        <span class="stat-label">Admins</span>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="delete-modal" @click.stop>
        <div class="modal-header">
          <h3>🗑️ Delete Staff Member</h3>
        </div>
        
        <div class="modal-content">
          <div class="staff-info-modal">
            <h4>{{ selectedStaff?.staff_name }}</h4>
            <p><strong>Role:</strong> {{ selectedStaff?.role }}</p>
            <p><strong>Email:</strong> {{ selectedStaff?.email }}</p>
            <p v-if="selectedStaff?.role === 'doctor'">
              <strong>Assigned Patients:</strong> {{ selectedStaff?.patientCount || 0 }}
            </p>
          </div>

          <div v-if="selectedStaff?.role === 'admin'" class="warning-section">
            <div class="warning-icon">🔒</div>
            <div class="warning-text">
              <h4>Cannot Delete Admin</h4>
              <p>Admin accounts cannot be deleted for security reasons.</p>
            </div>
          </div>

          <div v-else-if="selectedStaff?.role === 'doctor' && selectedStaff?.patientCount > 0" class="warning-section">
            <div class="warning-icon">⚠️</div>
            <div class="warning-text">
              <h4>Cannot Delete Doctor</h4>
              <p>This doctor has {{ selectedStaff.patientCount }} assigned patient(s). 
                 Please reassign them before deletion.</p>
            </div>
          </div>

          <div v-else class="confirmation-section">
            <div class="warning-list">
              <h4>⚠️ Warning:</h4>
              <ul>
                <li>This will permanently delete the staff member</li>
                <li>All their data will be removed</li>
                <li>This action cannot be undone</li>
              </ul>
            </div>

            <div class="confirmation-steps">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="deleteConfirmation.understood"
                />
                I understand this action is permanent
              </label>

              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="deleteConfirmation.confirmed"
                />
                I confirm I want to delete {{ selectedStaff?.staff_name }}
              </label>

              <div class="type-confirmation">
                <label>Type the staff member's name to confirm:</label>
                <input 
                  type="text"
                  v-model="typedName"
                  :placeholder="selectedStaff?.staff_name"
                  class="confirm-input"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button 
            v-if="canDelete"
            @click="deleteStaff"
            :disabled="!isDeleteReady"
            :class="['action-btn', 'delete', 'modal-delete', { 'disabled': !isDeleteReady }]"
          >
            {{ deleting ? 'Deleting...' : 'Delete Staff' }}
          </button>
          
          <button @click="closeDeleteModal" class="action-btn cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getAllStaff } from '@/services/staffs.js';
import axios from 'axios';

const staffList = ref([]);
const loading = ref(true);
const error = ref('');
const showDeleteModal = ref(false);
const selectedStaff = ref(null);
const deleting = ref(false);
const typedName = ref('');
const deleteConfirmation = ref({
  understood: false,
  confirmed: false
});

const canDelete = computed(() => {
  return selectedStaff.value && 
         selectedStaff.value.role !== 'admin' && 
         !(selectedStaff.value.role === 'doctor' && selectedStaff.value.patientCount > 0);
});

const isDeleteReady = computed(() => {
  return canDelete.value &&
         deleteConfirmation.value.understood &&
         deleteConfirmation.value.confirmed &&
         typedName.value === selectedStaff.value?.staff_name &&
         !deleting.value;
});

const getBaseURL = () => 'https://twoserverweb2.onrender.com';
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  };
};

const getInitials = (name) => {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const getRoleBadgeClass = (role) => {
  const classes = {
    admin: 'admin-badge',
    doctor: 'doctor-badge', 
    nurse: 'nurse-badge',
    staff: 'staff-badge'
  };
  return classes[role?.toLowerCase()] || 'default-badge';
};

const getDoctorCount = () => staffList.value.filter(s => s.role?.toLowerCase() === 'doctor').length;
const getNurseCount = () => staffList.value.filter(s => s.role?.toLowerCase() === 'nurse').length;
const getAdminCount = () => staffList.value.filter(s => s.role?.toLowerCase() === 'admin').length;

const fetchStaffData = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = 'You need to login first';
      return;
    }
    
    console.log('Fetching staff data...');
    const staffData = await getAllStaff();
    console.log('Staff data received:', staffData);
    
    try {
      const patientsResponse = await axios.get(`${getBaseURL()}/patients`, {
        headers: getAuthHeaders(),
        timeout: 10000
      });
      
      const patients = patientsResponse.data;
      
      staffList.value = staffData.map(staff => ({
        ...staff,
        patientCount: staff.role === 'doctor' 
          ? patients.filter(p => p.staff_id === staff._id).length 
          : 0
      }));
      
    } catch (patientErr) {
      console.warn('Could not load patient counts:', patientErr);
      staffList.value = staffData.map(staff => ({
        ...staff,
        patientCount: 0
      }));
    }
    
  } catch (err) {
    console.error('Error fetching staff:', err);
    
    if (err.response?.status === 401) {
      error.value = 'Your session has expired. Please login again.';
      localStorage.removeItem('token');
    } else if (err.response?.status === 403) {
      error.value = 'You do not have permission to view staff list.';
    } else {
      error.value = err.response?.data?.message || 'Failed to load staff data. Please try again.';
    }
  } finally {
    loading.value = false;
  }
};

const confirmDeleteStaff = (staff) => {
  selectedStaff.value = staff;
  showDeleteModal.value = true;
  resetDeleteForm();
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  selectedStaff.value = null;
  resetDeleteForm();
};

const resetDeleteForm = () => {
  deleteConfirmation.value = {
    understood: false,
    confirmed: false
  };
  typedName.value = '';
};

const deleteStaff = async () => {
  if (!isDeleteReady.value) return;

  const finalConfirm = confirm(
    `Are you absolutely sure you want to delete ${selectedStaff.value.staff_name}?\n\n` +
    `This action cannot be undone!`
  );

  if (!finalConfirm) return;

  try {
    deleting.value = true;

    console.log('Deleting staff:', selectedStaff.value._id);
    
    await axios.delete(`${getBaseURL()}/staffs/${selectedStaff.value._id}`, {
      headers: getAuthHeaders(),
      timeout: 10000
    });

    alert(`${selectedStaff.value.staff_name} has been successfully deleted.`);
    
    await fetchStaffData();
    closeDeleteModal();

  } catch (err) {
    console.error('Error deleting staff:', err);
    alert(err.response?.data?.message || 'Failed to delete staff member');
  } finally {
    deleting.value = false;
  }
};

onMounted(() => {
  fetchStaffData();
});
</script>

<style scoped>
.staff-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: #f8f9fa;
  min-height: 100vh;
}

.staff-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.staff-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.staff-header p {
  color: #6c757d;
  font-size: 1.1rem;
  margin: 0;
}

.btn {
  display: inline-block;
  padding: 12px 24px;
  background: #28a745;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: #28a745;
}

.btn:hover {
  background: #218838;
  transform: translateY(-1px);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e9ecef;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  text-align: center;
  padding: 4rem;
  background: #fff;
  border-radius: 10px;
  margin: 2rem auto;
  max-width: 500px;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.retry-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
}

.staff-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.staff-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.staff-card:hover {
  transform: translateY(-2px);
}

.staff-info {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.staff-avatar {
  width: 50px;
  height: 50px;
  background: #007bff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-right: 1rem;
}

.staff-details {
  flex: 1;
}

.staff-name {
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
}

.staff-email {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.admin-badge {
  background: #dc3545;
  color: white;
}

.doctor-badge {
  background: #007bff;
  color: white;
}

.nurse-badge {
  background: #28a745;
  color: white;
}

.staff-badge {
  background: #6c757d;
  color: white;
}

.staff-stats {
  margin-bottom: 1rem;
}

.staff-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.action-btn.delete {
  background: #dc3545;
  color: white;
}

.action-btn.edit {
  background: #fd7e14;
  color: white;
}

.action-btn:disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.stats-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.stat-item {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
}

.stat-label {
  color: #6c757d;
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  padding: 4rem;
  background: white;
  border-radius: 15px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.delete-modal {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  background: #dc3545;
  color: white;
  padding: 1.5rem;
  border-radius: 12px 12px 0 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
}

.modal-content {
  padding: 1.5rem;
}

.staff-info-modal {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.staff-info-modal h4 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.warning-section {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: flex-start;
}

.warning-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
}

.warning-text h4 {
  color: #856404;
  margin: 0 0 0.5rem 0;
}

.warning-text p {
  color: #856404;
  margin: 0;
}

.confirmation-section .warning-list {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.warning-list h4 {
  color: #721c24;
  margin: 0 0 0.5rem 0;
}

.warning-list ul {
  color: #721c24;
  margin: 0;
  padding-left: 1.5rem;
}

.confirmation-steps {
  margin-bottom: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  cursor: pointer;
  font-weight: 500;
}

.checkbox-label input {
  margin-right: 0.75rem;
  transform: scale(1.2);
}

.type-confirmation label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #495057;
}

.confirm-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
}

.confirm-input:focus {
  outline: none;
  border-color: #dc3545;
}

.modal-actions {
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.action-btn.modal-delete {
  background: #dc3545;
  color: white;
}

.action-btn.cancel {
  background: #6c757d;
  color: white;
}

.action-btn.disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}
</style>
