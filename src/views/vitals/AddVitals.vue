<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { createVital } from '@/services/vitals';
import { getPatientById } from '@/services/patients';

// ✅ Initialize route and router FIRST
const route = useRoute();
const router = useRouter();

// ✅ THEN use them in variables and console logs
const patientMongoId = route.params.id;

// ✅ Move debug logs to onMounted or after initialization
const patient = ref(null);
const loading = ref(true);
const error = ref('');

// ✅ Fix form - remove notes field since it's not in your DB schema
const vitalForm = ref({
  patient_id: patientMongoId,
  blood_pressure: '',
  pulse: '',
  temperature: '',
  resp_rate: ''
  // ✅ Removed 'notes' since it's not in your DB schema
});

onMounted(async () => {
  // ✅ Move debug logs here where route is guaranteed to be available
  console.log('=== ADD VITALS DEBUG ===');
  console.log('Route object:', route);
  console.log('Route params:', route.params);
  console.log('Route path:', route.path);
  console.log('Patient MongoDB ID:', patientMongoId);
  
  if (!patientMongoId) {
    error.value = 'Patient ID is missing from URL';
    loading.value = false;
    console.error('No patient ID found in route params');
    return;
  }
  
  try {
    console.log('Fetching patient with MongoDB _id:', patientMongoId);
    const patientData = await getPatientById(patientMongoId);
    console.log('Patient data received:', patientData);
    patient.value = patientData;
  } catch (err) {
    console.error('Error fetching patient:', err);
    error.value = err.response?.data?.message || 'Failed to load patient.';
  } finally {
    loading.value = false;
  }
});

const submitVital = async () => {
  if (!patientMongoId) {
    error.value = 'Patient ID is missing';
    return;
  }
  
  try {
    console.log('Submitting vital with data:', vitalForm.value);
    
    // ✅ Convert numbers and validate data
    const vitalData = {
      patient_id: vitalForm.value.patient_id,
      temperature: Number(vitalForm.value.temperature),
      blood_pressure: vitalForm.value.blood_pressure, // Keep as string
      pulse: Number(vitalForm.value.pulse),
      resp_rate: Number(vitalForm.value.resp_rate)
    };
    
    // ✅ Validate required fields
    if (!vitalData.temperature || !vitalData.blood_pressure || !vitalData.pulse || !vitalData.resp_rate) {
      error.value = 'Please fill in all required fields';
      return;
    }
    
    await createVital(vitalData);
    alert('Vital record saved successfully!');
    
    // ✅ Fix navigation path
    router.push(`/patient-details/${patientMongoId}`);
  } catch (err) {
    console.error('Error saving vital:', err);
    error.value = err.response?.data?.message || 'Failed to save vital record.';
  }
};
</script>

<template>
  <div class="add-vital-container">
    <!-- ✅ Remove debug section in production -->
    <!-- Debug section -->
    <div v-if="false" class="debug-section" style="background: #f0f0f0; padding: 15px; margin-bottom: 20px; border-radius: 5px;">
      <h3>🐛 Debug Info</h3>
      <p><strong>Route Path:</strong> {{ route.path }}</p>
      <p><strong>Route Params:</strong> {{ JSON.stringify(route.params) }}</p>
      <p><strong>Patient MongoDB ID:</strong> {{ patientMongoId }}</p>
      <p><strong>Loading:</strong> {{ loading }}</p>
      <p><strong>Error:</strong> {{ error }}</p>
      <p><strong>Patient Data:</strong> {{ patient ? patient.patient_name : 'No patient data' }}</p>
    </div>

    <!-- Main content -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <h2>Loading patient data...</h2>
      <p>Please wait while we fetch patient information...</p>
    </div>
    
    <div v-else-if="error" class="error-message">
      <h2>❌ Error</h2>
      <p>{{ error }}</p>
      <button @click="router.push('/patient-list')" class="btn btn-secondary">
        Back to Patient List
      </button>
    </div>
    
    <div v-else class="vital-form-section">
      <h2>🩺 Add Vital Signs for {{ patient?.patient_name || 'Unknown Patient' }}</h2>
      
      <div class="patient-info">
        <h3>Patient Information</h3>
        <p><strong>Name:</strong> {{ patient?.patient_name }}</p>
        <p><strong>Patient ID:</strong> {{ patient?.patient_id }}</p>
        <p><strong>Phone:</strong> {{ patient?.phone_num }}</p>
      </div>
      
      <!-- ✅ Updated form -->
      <form @submit.prevent="submitVital" class="vital-form">
        <div class="form-grid">
          <!-- ✅ Fix blood pressure input -->
          <div class="form-group">
            <label>Blood Pressure *</label>
            <input 
              v-model="vitalForm.blood_pressure" 
              placeholder="e.g., 120/80" 
              type="text" 
              pattern="[0-9]{2,3}/[0-9]{2,3}"
              required 
            />
            <small>Format: systolic/diastolic (e.g., 120/80)</small>
          </div>

          <div class="form-group">
            <label>Pulse (bpm) *</label>
            <input 
              v-model="vitalForm.pulse" 
              placeholder="e.g., 72" 
              type="number" 
              min="30" 
              max="250"
              required 
            />
            <small>Normal range: 60-100 bpm</small>
          </div>
          
          <div class="form-group">
            <label>Temperature (°C) *</label>
            <input 
              v-model="vitalForm.temperature" 
              placeholder="e.g., 36.5" 
              type="number" 
              step="0.1" 
              min="35" 
              max="45"
              required 
            />
            <small>Normal range: 36.1-37.2°C</small>
          </div>
          
          <div class="form-group">
            <label>Respiratory Rate (/min) *</label>
            <input 
              v-model="vitalForm.resp_rate" 
              placeholder="e.g., 16" 
              type="number" 
              min="8" 
              max="50"
              required 
            />
            <small>Normal range: 12-20 /min</small>
          </div>
        </div>
        
        <!-- ✅ Remove notes section since it's not in DB schema -->
        
        <div class="form-actions">
          <button type="submit" class="btn-primary">💾 Save Vital Signs</button>
          <button type="button" @click="router.push(`/patient-details/${patientMongoId}`)" class="btn-secondary">
            ← Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.add-vital-container {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.patient-info {
  background: #e3f2fd;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
}

.vital-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.form-group input {
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.form-group small {
  margin-top: 5px;
  color: #666;
  font-size: 12px;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.btn-primary {
  background: #28a745;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background: #218838;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background: #545b62;
}

.error-message {
  color: #721c24;
  background: #f8d7da;
  padding: 20px;
  border-radius: 6px;
  text-align: center;
}

.loading-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e9ecef;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>
