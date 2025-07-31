<script setup>
import RecordCard from '@/components/RecordCard.vue'
import { ref, onMounted, computed } from 'vue'
import { getAllRecords } from '@/services/records'

const records = ref([])
const patients = ref([])
const loading = ref(true)
const searchQuery = ref('')
const showModal = ref(false)
const recordForm = ref({
  patient_id: '',
  diagnosis: '',
  prescription: '',
  notes: ''
})

const filteredRecords = computed(() => {
  if (!searchQuery.value) return records.value
  const query = searchQuery.value.toLowerCase()
  return records.value.filter(record => 
    record.diagnosis?.toLowerCase().includes(query) ||
    record.prescription?.toLowerCase().includes(query) ||
    record.patient_name?.toLowerCase().includes(query)
  )
})

const fetchData = async () => {
  try {
    const data = await getAllRecords()
    records.value = data
    patients.value = [...new Map(data.map(r => [r.patient_id, {_id: r.patient_id, patient_name: r.patient_name}])).values()]
  } catch (err) {
    console.error('Failed to load records')
  } finally {
    loading.value = false
  }
}

const saveRecord = () => {
  console.log('Saving:', recordForm.value)
  showModal.value = false
  resetForm()
}

const editRecord = (record) => {
  recordForm.value = { ...record }
  showModal.value = true
}

const deleteRecord = (record) => {
  if (confirm(`Delete "${record.diagnosis}"?`)) {
    records.value = records.value.filter(r => r._id !== record._id)
  }
}

const resetForm = () => {
  recordForm.value = { patient_id: '', diagnosis: '', prescription: '', notes: '' }
}

onMounted(fetchData)
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>Medical Records</h1>
      <button @click="showModal = true" class="btn">Add Record</button>
    </div>

    <input v-model="searchQuery" placeholder="Search..." class="search" />

    <div v-if="loading" class="center">Loading...</div>
    
    <div v-else>
      <RecordCard 
        v-for="record in filteredRecords" 
        :key="record._id" 
        :record="record"
        @edit="editRecord"
        @delete="deleteRecord"
      />
      <div v-if="filteredRecords.length === 0" class="center">
        <p>No records found</p>
        <button @click="showModal = true" class="btn">Add First Record</button>
      </div>
    </div>

    <div v-if="showModal" class="modal" @click="showModal = false">
      <div class="modal-box" @click.stop>
        <h3>Medical Record</h3>
        <form @submit.prevent="saveRecord">
          <select v-model="recordForm.patient_id" required>
            <option value="">Select Patient</option>
            <option v-for="p in patients" :key="p._id" :value="p._id">{{ p.patient_name }}</option>
          </select>
          <input v-model="recordForm.diagnosis" placeholder="Diagnosis" required />
          <textarea v-model="recordForm.prescription" placeholder="Prescription" required></textarea>
          <textarea v-model="recordForm.notes" placeholder="Notes" required></textarea>
          <div class="actions">
            <button type="button" @click="showModal = false">Cancel</button>
            <button type="submit" class="btn">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container { padding: 2rem; max-width: 1000px; margin: 0 auto; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.search { width: 100%; padding: 0.75rem; margin-bottom: 2rem; border: 1px solid #ddd; border-radius: 4px; }
.btn { background: #007bff; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer; }
.center { text-align: center; padding: 2rem; }
.modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; }
.modal-box { background: white; padding: 2rem; border-radius: 8px; width: 90%; max-width: 400px; }
.modal-box h3 { margin: 0 0 1rem 0; }
.modal-box input, .modal-box textarea, .modal-box select { width: 100%; padding: 0.5rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 4px; }
.actions { display: flex; justify-content: flex-end; gap: 1rem; }
</style>