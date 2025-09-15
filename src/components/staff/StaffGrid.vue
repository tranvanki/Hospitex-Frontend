<template>
  <div class="staff-grid">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading staff data...</p>
    </div>
    
    <div v-else-if="!staffList || staffList.length === 0" class="empty-state-wrapper">
      <EmptyState
        title="No Staff Found"
        description="No staff members match your current filters."
        actionText="Clear Filters"
        @action="$emit('clearFilters')"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </template>
      </EmptyState>
    </div>
    
    <div v-else class="grid-container">
      <div v-for="staff in staffList" :key="staff._id || staff.id" class="staff-card">
        
        <div class="staff-info">
          <h3>{{ getStaffName(staff) }}</h3>
          <p class="staff-role">{{ staff.role }}</p>
          <p class="staff-department">{{ staff.department }}</p>
          <div class="staff-contact">
            <div class="contact-item">
              <span class="icon">📧</span>
              <span>{{ staff.email }}</span>
            </div>
            <div class="contact-item">
              <span class="icon">📱</span>
              <span>{{ staff.phone || 'N/A' }}</span>
            </div>
          </div>
        </div>
        <div class="staff-actions">
          <button class="edit-btn" @click="$emit('edit', staff)">Edit</button>
          <button class="delete-btn" @click="$emit('delete', staff)">Delete</button>
        </div>
      </div>
    </div>
    
    <pre v-if="debugMode">{{ staffList }}</pre>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import EmptyState from '@/components/ui/EmptyState.vue';

const props = defineProps({
  staffList: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  debugMode: {
    type: Boolean,
    default: false
  }
});

defineEmits(['clearFilters', 'edit', 'delete']);

// Helper to get staff name considering different property naming
function getStaffName(staff) {
  return staff.staff_name || staff.name || staff.fullName || 'Unknown Name';
}

// Log staff data for debugging
onMounted(() => {
  if (props.debugMode) {
    console.log('StaffGrid received staffList:', props.staffList);
  }
});
</script>

<style scoped>
.staff-grid {
  width: 100%;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state-wrapper {
  width: 100%;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.staff-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.staff-photo {
  position: relative;
  height: 150px;
  overflow: hidden;
}

.staff-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
}

.status-indicator.active {
  background-color: #10b981;
}

.status-indicator.inactive {
  background-color: #ef4444;
}

.status-indicator.on-leave {
  background-color: #f59e0b;
}

.staff-info {
  padding: 1.25rem;
  flex-grow: 1;
}

.staff-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #2c3e50;
}

.staff-role {
  color: #3b82f6;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.staff-department {
  color: #6b7280;
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
}

.staff-contact {
  margin-top: 0.75rem;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.contact-item .icon {
  margin-right: 0.5rem;
}

.staff-actions {
  padding: 1rem 1.25rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

.edit-btn, .delete-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s;
}

.edit-btn {
  background: #3b82f6;
  color: white;
  margin-right: 0.5rem;
}

.edit-btn:hover {
  background: #2563eb;
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.delete-btn:hover {
  background: #c62828;
}
</style>