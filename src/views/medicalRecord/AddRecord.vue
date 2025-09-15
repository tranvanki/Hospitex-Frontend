<template>
  <div class="add-record-container">
    <div class="add-record-card">
      <div class="page-header">
        <div class="breadcrumb">
          <router-link to="/patient-list" class="breadcrumb-link">👥 Patients</router-link>
          <span class="breadcrumb-separator">→</span>
          <router-link :to="`/patient/${patientId}`" class="breadcrumb-link">
            {{ patient?.patient_name || 'Patient' }}
          </router-link>
          <span class="breadcrumb-separator">→</span>
          <span class="breadcrumb-current">Add Medical Record</span>
        </div>
        <h1 class="page-title">📋 Add Medical Record</h1>
        <p class="page-subtitle" v-if="patient">
          Patient: {{ patient.patient_name }} ({{ patient.patient_id }})
        </p>
      </div>

      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="loading" class="loading-message">Loading patient data...</div>

      <form v-else @submit.prevent="submitRecord" class="record-form">
        <!-- Visit Date -->
        <div class="form-group">
          <label for="visit_date" class="form-label">
            📅 Visit Date *
          </label>
          <input
            id="visit_date"
            v-model="recordForm.visit_date"
            type="date"
            class="form-input"
            required
          />
          <small class="form-help">Date of the medical visit</small>
        </div>

        <!-- Diagnosis -->
        <div class="form-group">
          <label for="diagnosis" class="form-label">
            🔍 Diagnosis *
          </label>
          <textarea
            id="diagnosis"
            v-model="recordForm.diagnosis"
            placeholder="Enter patient diagnosis..."
            class="form-textarea"
            rows="3"
            required
          ></textarea>
          <small class="form-help">Primary diagnosis and conditions</small>
        </div>

        <!-- Prescription -->
        <div class="form-group">
          <label for="prescription" class="form-label">
            💊 Prescription *
          </label>
          <textarea
            id="prescription"
            v-model="recordForm.prescription"
            placeholder="Enter prescribed medications and dosages..."
            class="form-textarea"
            rows="4"
            required
          ></textarea>
          <small class="form-help">Medications, dosages, and instructions</small>
        </div>

        <!-- Notes -->
        <div class="form-group">
          <label for="notes" class="form-label">
            📝 Clinical Notes *
          </label>
          <textarea
            id="notes"
            v-model="recordForm.notes"
            placeholder="Enter additional clinical notes..."
            class="form-textarea"
            rows="5"
            required
          ></textarea>
          <small class="form-help">Additional observations, recommendations, and follow-up instructions</small>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            <span v-if="submitting">💾 Saving...</span>
            <span v-else>💾 Save Medical Record</span>
          </button>
          
          <button 
            type="button" 
            @click="router.push(`/patient-details/${patientId}`)"
            class="btn btn-secondary"
          ><!---patient-details-->
            ← Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPatientById } from '@/services/patients';
import { createMedicalRecord } from '@/services/records';

const route = useRoute();
const router = useRouter();

// Get patient ID from route
const patientId = route.params.id || route.params.patientId;

const patient = ref(null);
const loading = ref(true);
const error = ref('');
const submitting = ref(false);

// Format today's date for input
const today = new Date().toISOString().split('T')[0];

const recordForm = ref({
  visit_date: today, // Default to today
  diagnosis: '',
  prescription: '',
  notes: '',
  patient_id: patientId

});

onMounted(async () => {
  if (!patientId) {
    error.value = 'Patient ID is missing from URL';
    loading.value = false;
    return;
  }
  
  try {
    console.log('Fetching patient with ID:', patientId);
    const patientData = await getPatientById(patientId);
    console.log('Patient data:', patientData);
    patient.value = patientData;
  } catch (err) {
    console.error('Error fetching patient:', err);
    error.value = err.response?.data?.message || 'Failed to load patient.';
  } finally {
    loading.value = false;
  }
});

const submitRecord = async () => {
  if (!patientId) {
    error.value = 'Patient ID is missing';
    return;
  }
  
  try {
    submitting.value = true;
    error.value = '';
    
    console.log('Submitting medical record:', recordForm.value);
    
    await createMedicalRecord(recordForm.value);
    
    alert('Medical record saved successfully!');
    router.push(`/record-list`);
  } catch (err) {
    console.error('Error saving medical record:', err);
    error.value = err.response?.data?.message || 'Failed to save medical record.';
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.add-record-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.add-record-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  text-align: center;
}

.breadcrumb {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  font-size: 14px;
}

.breadcrumb-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: white;
}

.breadcrumb-separator {
  margin: 0 10px;
  opacity: 0.7;
}

.breadcrumb-current {
  color: white;
  font-weight: 500;
}

.page-title {
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: 600;
}

.page-subtitle {
  margin: 0;
  opacity: 0.9;
  font-size: 16px;
}

.record-form {
  padding: 30px;
}

.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 16px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-help {
  display: block;
  margin-top: 5px;
  color: #666;
  font-size: 14px;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
  transform: translateY(-2px);
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 30px;
  border: 1px solid #f5c6cb;
}

.loading-message {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 18px;
}
</style>
