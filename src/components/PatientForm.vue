<script setup>
import axios from 'axios';
import { onMounted,ref } from 'vue';
const patients = ref([]);

onMounted(async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get('/api/patients/my', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  patients.value = res.data;
});
</script>
<template>

   <div class="info-card">
          <h2 class="card-title">Patient Information</h2>
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
              <label>Phone Number</label>
              <span>{{ patient.phone_num || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <label>Medical History</label>
              <span>{{ patient.medical_history || 'No history recorded' }}</span>
            </div>
            <div class="info-item">
              <label>Discharge Status</label>
              <span class="status-badge" :class="patient.discharge_status?.toLowerCase()">
                {{ patient.discharge_status || 'Active' }}
              </span>
            </div>
          </div>
          <div class="action-buttons">
            <button @click="handleEdit" class="btn btn-primary">✏️ Edit</button>
            <button @click="handleDelete" class="btn btn-danger">🗑️ Delete</button>
          </div>
        </div>
</template>

<style scoped></style>