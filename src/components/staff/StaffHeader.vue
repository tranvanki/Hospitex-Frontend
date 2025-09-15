<!-- components/staff/StaffHeader.vue -->
<template>
  <div class="staff-header">
    <div class="header-content">
      <h1>Staff Management</h1>
      <p>Manage hospital staff members and their information</p>
    </div>
    <div class="header-actions">
      <button class="add-button" @click="$emit('add-staff')">
        <span class="icon">+</span>
        Add New Staff
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['add-staff']);
</script>

<style scoped>
.staff-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-content h1 {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  color: #1f2937;
}

.header-content p {
  margin: 0;
  color: #6b7280;
}

.header-actions {
  display: flex;
  align-items: center;
}

.add-button {
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  font-weight: 600;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: #059669;
}

.add-button .icon {
  margin-right: 0.5rem;
  font-size: 1.25rem;
  line-height: 1;
}

@media (max-width: 768px) {
  .staff-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-actions {
    margin-top: 1rem;
  }
}
</style>