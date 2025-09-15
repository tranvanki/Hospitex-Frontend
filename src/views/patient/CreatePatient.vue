<script setup>
import { ref } from 'vue';
import Navbar from '@/components/Navbar.vue';
import { createPatient } from '@/services/patients.js';
import { useRouter } from 'vue-router';

const form = ref({
  patient_name: '',
  patient_id: '',
  phone_num: '',
  medical_history: '',
  discharge_status: '',
  gender: '',
  date_of_birth: '',
  address: '',
  email: ''
});

const error = ref('');
const loading = ref(false);
const router = useRouter();

const handleSubmit = async () => {
  // Frontend validation
  const errors = [];
  
  if (!form.value.patient_name?.trim()) errors.push('Patient name is required');
  if (!form.value.patient_id?.trim()) errors.push('Patient ID is required');
  if (!form.value.phone_num?.trim()) errors.push('Phone number is required');
  if (!form.value.medical_history?.trim()) errors.push('Medical history is required');
  if (!form.value.discharge_status?.trim()) errors.push('Discharge status is required');
  if (!form.value.gender) errors.push('Gender is required');
  if (!form.value.date_of_birth) errors.push('Date of birth is required');
  if (!form.value.address?.trim()) errors.push('Address is required');
  if (!form.value.email?.trim()) errors.push('Email is required');
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (form.value.email && !emailRegex.test(form.value.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (errors.length > 0) {
    error.value = 'Please fix the following errors:\n' + errors.join('\n');
    return;
  }

  loading.value = true;
  error.value = '';
  
  try {
    console.log('Creating patient with data:', form.value);
    await createPatient(form.value);
    alert('Patient created successfully!');
    router.push('/patient-list');
  } catch (err) {
    console.error('Error creating patient:', err);
    error.value = err.response?.data?.message || 'Failed to create patient.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div>
    <Navbar />
    <div class="create-patient-container">
      <div class="create-patient-card">
        <div class="page-header">
          <div class="breadcrumb">
            <router-link to="/patient-list" class="breadcrumb-link">Patients</router-link>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">Create New Patient</span>
          </div>
          <h1 class="page-title">Create New Patient</h1>
        </div>

        <div class="form-container">
          <form @submit.prevent="handleSubmit">
            <!-- Personal Information Section -->
            <div class="form-section">
              <h3 class="section-title">Personal Information</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="patient_name">Patient Name *</label>
                  <input 
                    type="text"
                    id="patient_name"
                    v-model="form.patient_name" 
                    placeholder="Enter full name"
                    class="form-input"
                    required 
                  />
                </div>
                
                <div class="form-group">
                  <label for="patient_id">Patient ID *</label>
                  <input 
                    type="text"
                    id="patient_id"
                    v-model="form.patient_id" 
                    placeholder="Enter unique patient ID"
                    class="form-input"
                    required 
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="gender">Gender *</label>
                  <select 
                    id="gender"
                    v-model="form.gender" 
                    class="form-input"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="date_of_birth">Date of Birth *</label>
                  <input 
                    type="date"
                    id="date_of_birth"
                    v-model="form.date_of_birth"
                    class="form-input"
                    :max="new Date().toISOString().split('T')[0]"
                    required 
                  />
                </div>
              </div>
            </div>

            <!-- Contact Information Section -->
            <div class="form-section">
              <h3 class="section-title">Contact Information</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="phone_num">Phone Number *</label>
                  <input 
                    type="tel"
                    id="phone_num"
                    v-model="form.phone_num" 
                    placeholder="Enter phone number"
                    class="form-input"
                    required 
                  />
                </div>
                
                <div class="form-group">
                  <label for="email">Email *</label>
                  <input 
                    type="email"
                    id="email"
                    v-model="form.email" 
                    placeholder="Enter email address"
                    class="form-input"
                    required 
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="address">Address *</label>
                <textarea 
                  id="address"
                  v-model="form.address" 
                  placeholder="Enter full address"
                  class="form-textarea"
                  rows="3"
                  required
                ></textarea>
              </div>
            </div>

            <!-- Medical Information Section -->
            <div class="form-section">
              <h3 class="section-title">Medical Information</h3>
              
              <div class="form-group">
                <label for="medical_history">Medical History *</label>
                <textarea 
                  id="medical_history"
                  v-model="form.medical_history" 
                  placeholder="Enter patient's medical history, allergies, previous conditions, etc."
                  class="form-textarea"
                  rows="4"
                  required
                ></textarea>
              </div>
              
              <div class="form-group">
                <label for="discharge_status">Discharge Status *</label>
                <select 
                  id="discharge_status"
                  v-model="form.discharge_status" 
                  class="form-input"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Admitted">Admitted</option>
                  <option value="Discharged">Discharged</option>
                  <option value="Under Treatment">Under Treatment</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Outpatient">Outpatient</option>
                </select>
              </div>
            </div>

            <!-- Error Display -->
            <div v-if="error" class="error-message">
              {{ error }}
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="loading"
              >
                {{ loading ? 'Creating...' : 'Create Patient' }}
              </button>
              
              <button 
                type="button"
                @click="router.push('/patient-list')" 
                class="btn btn-secondary"
                :disabled="loading"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.create-patient-container {
  min-height: 100vh;
  background: #f8fafc;
  padding: 2rem 1rem;
}

.create-patient-card {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 14px;
}

.breadcrumb-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: white;
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  color: rgba(255, 255, 255, 0.6);
}

.breadcrumb-current {
  color: white;
  font-weight: 500;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
}

.form-container {
  padding: 2rem;
}

.form-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.error-message {
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  white-space: pre-line;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5a67d8;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #4b5563;
}

@media (max-width: 640px) {
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>