<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PatientForm from '@/components/PatientForm.vue';
import { getPatientById, updatePatientById } from '@/services/patients';

const route = useRoute();
const router = useRouter();
const patient = ref({});
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const data = await getPatientById(route.params.id);
    patient.value = data;
  } catch (err) {
    error.value = 'Failed to load patient data';
  } finally {
    loading.value = false;
  }
});

const handleUpdate = async (updatedData) => {
  try {
    await updatePatientById(route.params.id, updatedData);
    alert('Patient updated successfully!');
    router.push(`/patient/${route.params.id}`);
  } catch (err) {
    alert('Failed to update patient');
  }
};

const handleCancel = () => {
  router.push(`/patient/${route.params.id}`);
};
</script>

<template>
  <div class="edit-patient-container">
    <div class="edit-patient-header">
      <h1>Edit Patient</h1>
      <router-link to="/patient-list" class="back-link">← Back to Patient List</router-link>
    </div>
    
    <div v-if="loading" class="loading">
      Loading patient data...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <!-- ✅ USE PatientForm COMPONENT FOR EDITING -->
    <PatientForm 
      v-else
      :initialData="patient"
      :isEditMode="true"
      @submit="handleUpdate"
      @cancel="handleCancel"
    />
  </div>
</template>

<style scoped>
.edit-patient-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.edit-patient-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.back-link {
  color: #007bff;
  text-decoration: none;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.error {
  color: #dc3545;
}
</style>

