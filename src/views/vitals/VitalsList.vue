<script setup>
import Navbar from '@/components/Navbar.vue';
import { ref, onMounted } from 'vue';
import { getAllVitals } from '@/services/vitals.js';

const vitals = ref([]);
const loading = ref(true);
const error = ref(null);

// ✅ Add date formatting function
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

onMounted(async () => {
  try {
    console.log('Fetching all vitals...');
    const data = await getAllVitals();
    console.log('Vitals data received:', data);
    vitals.value = data;
  } catch (err) {
    console.error('Error in component:', err);
    error.value = err.response?.data?.message || 'Error fetching vitals';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="vitals-list-container">
    <div class="vitals-header">
      <h1>📊 All Vitals Records</h1>
      <p>Complete overview of patient vital signs</p>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading vitals data...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <button @click="$router.go(-1)" class="btn-secondary">Go Back</button>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="vitals.length === 0" class="empty-state">
      <div class="empty-icon">📊</div>
      <h3>No Vitals Records Found</h3>
      <p>No vital signs have been recorded yet.</p>
      <router-link to="/patient-list" class="btn-primary">
        View Patients to Add Vitals
      </router-link>
    </div>
    
    <!-- Vitals Table -->
    <div v-else class="vitals-table-container">
      <div class="table-header">
        <h2>Vitals Records ({{ vitals.length }})</h2>
      </div>
      
      <div class="table-wrapper">
        <table class="vitals-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date Recorded</th>
              <th>Blood Pressure</th>
              <th>Pulse</th>
              <th>Temperature</th>
              <th>Resp Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="vital in vitals" :key="vital._id" class="vital-row">
              <!-- ✅ Patient Info -->
              <td class="patient-cell">
                <div class="patient-info">
                  <span class="patient-name">{{ vital.patient_id?.patient_name || 'Unknown' }}</span>
                  <span class="patient-id">{{ vital.patient_id?.patient_id || 'N/A' }}</span>
                </div>
              </td>
              
              <!-- ✅ Use timestamp field -->
              <td class="date-cell">
                {{ formatDate(vital.timestamp) }}
              </td>
              
              <!-- ✅ Use blood_pressure (String) -->
              <td class="bp-cell">
                <span class="bp-reading">{{ vital.blood_pressure }}</span>
                <span class="bp-unit">mmHg</span>
              </td>
              
              <!-- ✅ Use pulse (not heart_rate) -->
              <td class="pulse-cell">
                <span class="vital-value">{{ vital.pulse }}</span>
                <span class="vital-unit">bpm</span>
              </td>
              
              <!-- ✅ Use temperature -->
              <td class="temp-cell">
                <span class="vital-value">{{ vital.temperature }}</span>
                <span class="vital-unit">°C</span>
              </td>
              
              <!-- ✅ Use resp_rate -->
              <td class="rr-cell">
                <span class="vital-value">{{ vital.resp_rate }}</span>
                <span class="vital-unit">/min</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vitals-list-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: #f8f9fa;
  min-height: 100vh;
}

.vitals-header {
  text-align: center;
  margin-bottom: 2rem;
}

.vitals-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.vitals-header p {
  color: #6c757d;
  font-size: 1.1rem;
}

/* Loading, Error, Empty States */
.loading-state, .error-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e9ecef;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon, .empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

/* Table Styles */
.vitals-table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.table-wrapper {
  overflow-x: auto;
}

.vitals-table {
  width: 100%;
  border-collapse: collapse;
}

.vitals-table th {
  background: #f8f9fa;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
}

.vitals-table td {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.vital-row:hover {
  background: #f8f9fa;
}

/* Cell Specific Styles */
.patient-info {
  display: flex;
  flex-direction: column;
}

.patient-name {
  font-weight: 600;
  color: #495057;
}

.patient-id {
  font-size: 0.875rem;
  color: #6c757d;
}

.bp-reading, .vital-value {
  font-weight: 600;
  color: #495057;
}

.bp-unit, .vital-unit {
  font-size: 0.875rem;
  color: #6c757d;
  margin-left: 0.25rem;
}

.date-cell {
  color: #6c757d;
  font-size: 0.875rem;
}

.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}

@media (max-width: 768px) {
  .vitals-table {
    font-size: 0.875rem;
  }
  
  .vitals-table th,
  .vitals-table td {
    padding: 0.5rem;
  }
}
</style>