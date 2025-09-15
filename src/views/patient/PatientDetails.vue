<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPatientById, deletePatientById } from '@/services/patients';

const patient = ref({});
const error = ref('');
const loading = ref(true);
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  try {
    const data = await getPatientById(route.params.id);
    console.log('Patient data:', data);
    patient.value = data;
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load patient.';
  } finally {
    loading.value = false;
  }
});

const handleEdit = async () => {
  try {
    await router.push(`/edit-patient/${route.params.id}`);
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to navigate to edit patient.';
  }
}

const handleDelete = async () => {
  if (confirm(`Are you sure you want to delete patient ${patient.value.patient_name}?`)) {
    try {
      await deletePatientById(route.params.id);
      alert('Patient deleted successfully');
      router.push('/patient-list');
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete patient.';
    }
  }
};

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString();
};

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};
</script>

<template>
  <div class="patient-details-container">
    <div class="patient-details-card">
      <!-- Header with Breadcrumb -->
      <div class="page-header">
        <div class="breadcrumb">
          <router-link to="/patient-list" class="breadcrumb-link">👥 Patients</router-link>
          <span class="breadcrumb-separator">→</span>
          <span class="breadcrumb-current">{{ patient.patient_name || 'Patient Details' }}</span>
        </div>
        <h1 class="page-title">{{ patient.patient_name || 'Patient Details' }}</h1>
      </div>

      <!-- Loading & Error States -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading patient information...</p>
      </div>
      
      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <p>{{ error }}</p>
        <button @click="router.push('/patient-list')" class="btn btn-secondary">
          Back to Patient List
        </button>
      </div>

      <!-- Patient Information -->
      <div v-else class="patient-content">
        <!-- Patient Info Card -->
        <div class="info-card">
          <h3 class="card-title">Patient Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Patient ID</label>
              <span>{{ patient.patient_id || 'N/A' }}</span>
            </div>
            
            <div class="info-item">
              <label>Full Name</label>
              <span>{{ patient.patient_name || 'N/A' }}</span>
            </div>
            
            <div class="info-item">
              <label>Date of Birth</label>
              <span>{{ formatDate(patient.date_of_birth) || 'N/A' }}</span>
            </div>
            
            
            <div class="info-item">
              <label>Gender</label>
              <span>{{ patient.gender || 'N/A' }}</span>
            </div>
            
            <div class="info-item">
              <label>Phone Number</label>
              <span>{{ patient.phone_number || 'N/A' }}</span>
            </div>
            
            <div class="info-item">
              <label>Address</label>
              <span>{{ patient.address || 'N/A' }}</span>
            </div>
            
            <div class="info-item">
              <label>Assigned Doctor</label>
              <span>{{ patient.staff_name || 'Unassigned' }}</span>
            </div>
            
            <div class="info-item">
              <label>Medical History</label>
              <span>{{ patient.medical_history || 'No medical history recorded' }}</span>
            </div>
            
            <div class="info-item">
              <label>Discharge Status</label>
              <span class="status-badge" :class="patient.discharge_status?.toLowerCase()">
                {{ patient.discharge_status || 'Active' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="actions-section">
          <h3 class="section-title">Actions</h3>
          <div class="action-buttons">
            <button 
              @click="handleEdit" 
              class="btn btn-primary"
            >
              <span class="btn-icon">✏️</span>
              Edit Patient
            </button>
            
            <button 
              @click="handleDelete" 
              class="btn btn-danger"
            >
              <span class="btn-icon">🗑️</span>
              Delete Patient
            </button>
            
            <button 
              @click="router.push('/patient-list')" 
              class="btn btn-secondary"
            >
              <span class="btn-icon">←</span>
              Back to List
            </button>
          </div>
        </div>

        <!-- Patient Care Actions -->
        <div class="care-actions-section">
          <h3 class="section-title">Patient Care</h3>
          <div class="care-buttons">
            <router-link :to="`/patient/${route.params.id}/add-vitals`" class="care-btn vitals">
              <div class="care-btn-icon">❤️</div>
              <div class="care-btn-content">
                <span class="care-btn-title">Add Vitals</span>
                <span class="care-btn-subtitle">Record vital signs</span>
              </div>
            </router-link>
            
            <router-link :to="`/patient/${route.params.id}/vitals`" class="care-btn vitals-view">
              <div class="care-btn-icon">📊</div>
              <div class="care-btn-content">
                <span class="care-btn-title">View Vitals</span>
                <span class="care-btn-subtitle">Check vital history</span>
              </div>
            </router-link>
            
            <router-link :to="`/patient/${route.params.id}/add-record`" class="care-btn records">
              <div class="care-btn-icon">📋</div>
              <div class="care-btn-content">
                <span class="care-btn-title">Add Record</span>
                <span class="care-btn-subtitle">Create medical record</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.patient-details-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 20px;
  background-color: #f8f9fa;
}

.patient-details-card {
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Header */
.page-header {
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.breadcrumb {
  font-size: 14px;
  margin-bottom: 10px;
  opacity: 0.9;
}

.breadcrumb-link {
  color: white;
  text-decoration: none;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  margin: 0 8px;
}

.breadcrumb-current {
  opacity: 0.8;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin: 0;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 60px 30px;
  color: #6c757d;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e9ecef;
  border-left: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.error-state {
  text-align: center;
  padding: 60px 30px;
  color: #dc3545;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

/* Patient Content */
.patient-content {
  padding: 30px;
}

.info-card {
  margin-bottom: 30px;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #343a40;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 10px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-item label {
  font-weight: 600;
  color: #495057;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item span {
  font-size: 16px;
  color: #212529;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.discharged {
  background: #f8d7da;
  color: #721c24;
}

/* Sections */
.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #343a40;
}

.actions-section {
  margin-bottom: 30px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.btn-icon {
  margin-right: 8px;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
  transform: translateY(-1px);
}

/* Care Actions */
.care-actions-section {
  border-top: 1px solid #e9ecef;
  padding-top: 30px;
}

.care-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 15px;
}

.care-btn {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.care-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.care-btn.vitals {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
}

.care-btn.vitals-view {
  background: linear-gradient(135deg, #4ecdc4, #44a08d);
  color: white;
}

.care-btn.records {
  background: linear-gradient(135deg, #a55eea, #8e44ad);
  color: white;
}

.care-btn-icon {
  font-size: 24px;
  margin-right: 15px;
}

.care-btn-content {
  display: flex;
  flex-direction: column;
}

.care-btn-title {
  font-weight: 600;
  font-size: 16px;
}

.care-btn-subtitle {
  font-size: 12px;
  opacity: 0.9;
}

/* Responsive */
@media (max-width: 768px) {
  .patient-details-container {
    padding: 10px;
  }
  
  .page-header {
    padding: 20px;
  }
  
  .patient-content {
    padding: 20px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .care-buttons {
    grid-template-columns: 1fr;
  }
}
</style>