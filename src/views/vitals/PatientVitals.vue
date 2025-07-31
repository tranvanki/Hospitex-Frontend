<!-- filepath: /home/kien/CWweb2/client/src/views/vitals/PatientVitals.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getVitalsByPatientId } from '@/services/vitals';
import { getPatientById } from '@/services/patients';

const route = useRoute();
const router = useRouter();
const patientId = route.params.patientId;

const patient = ref(null);
const vitals = ref([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    // Load patient info
    patient.value = await getPatientById(patientId);
    
    // Load vitals for this patient
    vitals.value = await getVitalsByPatientId(patientId);
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load data.';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="p-4 max-w-4xl mx-auto">
    <div v-if="loading">Loading vitals data...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold">Vitals for {{ patient?.patient_name }}</h2>
        <router-link 
          :to="`/patient/${patientId}/add-vitals`" 
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Vitals
        </router-link>
      </div>
      
      <div v-if="vitals.length === 0" class="text-center py-8 border rounded bg-gray-50">
        No vitals records found for this patient.
      </div>
      
      <table v-else class="min-w-full border-collapse border">
        <thead class="bg-gray-100">
          <tr>
            <th class="border p-2">Date & Time</th>
            <th class="border p-2">Temperature (°C)</th>
            <th class="border p-2">Blood Pressure</th>
            <th class="border p-2">Pulse (bpm)</th>
            <th class="border p-2">Respiratory Rate</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="vital in vitals" :key="vital._id" class="hover:bg-gray-50">
            <td class="border p-2">{{ new Date(vital.timestamp).toLocaleString() }}</td>
            <td class="border p-2">{{ vital.temperature }}</td>
            <td class="border p-2">{{ vital.blood_pressure }}</td>
            <td class="border p-2">{{ vital.pulse }}</td>
            <td class="border p-2">{{ vital.resp_rate }}</td>
          </tr>
        </tbody>
      </table>
      
      <div class="mt-6">
        <button 
          @click="router.push(`/patient-details/${patientId}`)" 
          class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back to Patient Details
        </button>
      </div>
    </div>
  </div>
</template>