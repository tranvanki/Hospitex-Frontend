<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPatientById, updatePatientById } from '@/services/patients';
import { getAllStaff } from '@/services/staffs';

// ✅ Receive the id prop from the route
const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const route = useRoute();
const router = useRouter();

// ✅ Use the prop or route params (both should work)
const patientId = props.id || route.params.id;

const formData = ref({
  patient_id: '',
  patient_name: '',
  date_of_birth: '',
  gender: '',
  phone_number: '',
  email: '',
  address: '',
  emergency_contact: '',
  staff_id: '',
  medical_history: '',
  status: 'Active'
});

const doctors = ref([]);
const loading = ref(true);
const submitting = ref(false);
const error = ref('');

// Format date for input field
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split('T')[0];
};

onMounted(async () => {
  try {
    console.log('Loading patient with ID:', patientId);
    
    // Load patient data and doctors list
    const [patientData, staffData] = await Promise.all([
      getPatientById(patientId),
      getAllStaff()
    ]);

    console.log('Loaded patient data:', patientData);

    // Populate form with patient data
    formData.value = {
      ...patientData,
      date_of_birth: formatDateForInput(patientData.date_of_birth)
    };

    // Filter doctors from staff
    doctors.value = staffData.filter(staff => 
      staff.role && staff.role.toLowerCase().includes('doctor')
    );

  } catch (err) {
    console.error('Error loading data:', err);
    error.value = err.response?.data?.message || 'Failed to load patient data.';
  } finally {
    loading.value = false;
  }
});

const handleSubmit = async () => {
  submitting.value = true;
  
  try {
    console.log('Updating patient:', patientId, formData.value);
    
    await updatePatientById(patientId, formData.value);
    alert('Patient updated successfully!');
    router.push({
      name: 'PatientDetails',
      params: { id: patientId }
    });
  } catch (err) {
    console.error('Update error:', err);
    
    if (err.response) {
      error.value = err.response.data.message || err.response.data.error || 'Failed to update patient.';
    } else if (err.request) {
      error.value = 'Cannot connect to server. Please check your internet connection.';
    } else {
      error.value = `Update failed: ${err.message}`;
    }
    
    alert(error.value);
  } finally {
    submitting.value = false;
  }
};

const handleCancel = () => {
  router.push({
    name: 'PatientDetails',
    params: { id: patientId }
  });
};
</script>

<template>
  <div class="edit-patient-container">
    <div class="edit-patient-card">
      <!-- Header -->
      <div class="page-header">
        <div class="breadcrumb">
          <router-link to="/patient-list" class="breadcrumb-link">👥 Patients</router-link>
          <span class="breadcrumb-separator">→</span>
          <router-link :to="`/patient-details/${patientId}`" class="breadcrumb-link">
            {{ formData.patient_name || 'Patient' }}
          </router-link>
          <span class="breadcrumb-separator">→</span>
          <span class="breadcrumb-current">Edit</span>
        </div>
        <h1 class="page-title">Edit Patient</h1>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading patient information...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <p>{{ error }}</p>
        <button @click="router.push('/patient-list')" class="btn btn-secondary">
          Back to Patient List
        </button>
      </div>

      <!-- Edit Form -->
      <div v-else class="form-container">
        <form @submit.prevent="handleSubmit">
          <div class="form-grid">
            <!-- Patient ID (readonly) -->
            <div class="form-group">
              <label for="patient_id">Patient ID</label>
              <input 
                type="text" 
                id="patient_id" 
                v-model="formData.patient_id" 
                readonly
                class="readonly"
              />
            </div>

            <!-- Patient Name -->
            <div class="form-group">
              <label for="patient_name">Full Name *</label>
              <input 
                type="text" 
                id="patient_name" 
                v-model="formData.patient_name" 
                required
              />
            </div>

            <!-- Date of Birth -->
            <div class="form-group">
              <label for="date_of_birth">Date of Birth *</label>
              <input 
                type="date" 
                id="date_of_birth" 
                v-model="formData.date_of_birth" 
                required
              />
            </div>

            <!-- Gender -->
            <div class="form-group">
              <label for="gender">Gender *</label>
              <select id="gender" v-model="formData.gender" required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <!-- Phone Number -->
            <div class="form-group">
              <label for="phone_number">Phone Number</label>
              <input 
                type="tel" 
                id="phone_number" 
                v-model="formData.phone_number"
              />
            </div>

            <!-- Email -->
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="formData.email"
              />
            </div>

            <!-- Address -->
            <div class="form-group full-width">
              <label for="address">Address</label>
              <textarea 
                id="address" 
                v-model="formData.address"
                rows="3"
              ></textarea>
            </div>

            <!-- Emergency Contact -->
            <div class="form-group">
              <label for="emergency_contact">Emergency Contact</label>
              <input 
                type="text" 
                id="emergency_contact" 
                v-model="formData.emergency_contact"
              />
            </div>

            <!-- Assigned Doctor -->
            <div class="form-group">
              <label for="staff_id">Assigned Doctor</label>
              <select id="staff_id" v-model="formData.staff_id">
                <option value="">Select Doctor</option>
                <option v-for="doctor in doctors" :key="doctor.staff_id" :value="doctor.staff_id">
                  {{ doctor.staff_name }}
                </option>
              </select>
            </div>

            <!-- Medical History -->
            <div class="form-group full-width">
              <label for="medical_history">Medical History</label>
              <textarea 
                id="medical_history" 
                v-model="formData.medical_history"
                rows="4"
                placeholder="Enter patient's medical history..."
              ></textarea>
            </div>

            <!-- Status -->
            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" v-model="formData.status">
                <option value="Active">Active</option>
                <option value="Discharged">Discharged</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              <span v-if="submitting">Updating...</span>
              <span v-else>Update Patient</span>
            </button>
            <button 
              type="button" 
              @click="handleCancel"
              class="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.edit-patient-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 20px;
  background-color: #f8f9fa;
}

.edit-patient-card {
  width: 100%;
  max-width: 900px;
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

/* Loading & Error States */
.loading-state, .error-state {
  text-align: center;
  padding: 60px 30px;
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

.error-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

/* Form */
.form-container {
  padding: 30px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #495057;
  font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
}

.form-group input.readonly {
  background-color: #f8f9fa;
  color: #6c757d;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

/* Buttons */
.form-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  border-top: 1px solid #e9ecef;
  padding-top: 30px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 16px;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .edit-patient-container {
    padding: 10px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>

