<template>
  <div class="record-card">
    <div class="record-header">
      <div class="record-info">
        <h3>{{ record.diagnosis }}</h3>
        <p class="visit-date">{{ formatDate(record.visit_date) }}</p>
        <p class="patient-name">Patient: {{ record.patient_name }}</p>
      </div>
      
      <div class="record-actions" v-if="showActions">
        <button @click="$emit('edit', record)" class="btn-edit">Edit</button>
        <button @click="$emit('delete', record)" class="btn-delete">Delete</button>
      </div>
    </div>
    
    <div class="record-content">
      <div class="field">
        <label>Diagnosis:</label>
        <p>{{ record.diagnosis }}</p>
      </div>
    
      <div class="field">
        <label>Prescription:</label>
        <p>{{ record.prescription }}</p>
      </div>
      
      <div class="field">
        <label>Notes:</label>
        <p>{{ record.notes }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  record: { type: Object, required: true },
  showActions: { type: Boolean, default: true }
})

defineEmits(['edit', 'delete'])

const formatDate = (date) => {
  if (!date) return 'Unknown'
  return new Date(date).toLocaleDateString()
}
</script>

<style scoped>
.record-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.record-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.record-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.visit-date, .patient-name {
  margin: 0 0 0.25rem 0;
  color: #666;
  font-size: 0.9rem;
}

.record-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit, .btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}

.btn-edit {
  background: #ffc107;
  color: #000;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.field {
  margin-bottom: 1rem;
}

.field label {
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 0.25rem;
}

.field p {
  margin: 0;
  color: #666;
  background: #f8f9fa;
  padding: 0.5rem;
  border-radius: 4px;
}
</style>