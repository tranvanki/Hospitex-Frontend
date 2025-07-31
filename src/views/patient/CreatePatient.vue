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
  discharge_status: ''
});

const error = ref('');
const router = useRouter();

const handleSubmit = async () => {
  try {
    await createPatient(form.value);
    router.push('/patient-list');
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to create patient.';
  }
};
</script>

<template>
  <div class="p-4 max-w-md mx-auto">
    <h2 class="text-xl font-bold mb-4">Create New Patient</h2>
    <form @submit.prevent="handleSubmit">
      <input v-model="form.patient_name" placeholder="Patient Name" class="input" required />
      <input v-model="form.patient_id" placeholder="Patient ID" class="input" required />
      <input v-model="form.phone_num" placeholder="Phone Number" class="input" required />
      <input v-model="form.medical_history" placeholder="Medical History" class="input" required />
      <input v-model="form.discharge_status" placeholder="Discharge Status" class="input" required />
      <button class="btn">Create</button>
      <button @click="router.push('/patient-list')" class="cancel-btn">Cancel</button>
      <p class="text-red-500 mt-2">{{ error }}</p>
    </form>
  </div>
</template>

<style scoped>
.input { display: block; margin: 10px 0; padding: 8px; border: 1px solid #ccc; }
.btn { padding: 8px 16px; background: green; color: white; border: none; }
.cancel-btn { padding: 8px 16px; background: red; color: white; border: none; margin-left: 10px; }
</style>