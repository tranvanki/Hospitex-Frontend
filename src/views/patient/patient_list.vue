<script setup>
import { onMounted, ref } from 'vue'
import Navbar from '@/components/Navbar.vue';
import { getMyPatients } from '@/services/patients.js'

const patients = ref([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    patients.value = await getMyPatients()
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load patients.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">My Patients</h2>

    <div v-if="loading">Loading patients...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else>
      <router-link 
        to="/create-patient" 
        class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-4 inline-block"
      ><button>Add New Patient</button>
        
      </router-link>
 <table class="min-w-full border-collapse border border-gray-300 mt-4">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-4 py-2">Patient Name</th>
            <th class="border px-4 py-2">Phone</th>
            <th class="border px-4 py-2">Medical History</th>
            <th class="border px-4 py-2">Discharge Status</th>
            <th class="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in patients" :key="p._id" class="hover:bg-gray-50">
            <td class="border px-4 py-2">{{ p.patient_name }}</td>
            <td class="border px-4 py-2">{{ p.phone_num }}</td>
            <td class="border px-4 py-2">{{ p.medical_history }}</td>
            <td class="border px-4 py-2">{{ p.discharge_status }}</td>
            <td class="border px-4 py-2">
              <router-link 
                :to="`/patient-details/${p._id}`" 
                class="text-blue-500 hover:underline mr-2"
              >
                View
              </router-link>
              <router-link 
                :to="`/edit-patient/${p._id}`" 
                class="text-green-500 hover:underline"
              >
                Edit
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="patients.length === 0" class="text-center py-4">
        No patients found. <router-link to="/create-patient" class="text-blue-500">Add your first patient</router-link>.
      </div>
    </div>
  </div>
</template>
