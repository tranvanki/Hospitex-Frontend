<template>
  <div class="staff-filters">
    <div class="filters-header">
      <h3>Filter Staff</h3>
      <button 
        v-if="hasActiveFilters" 
        @click="clearAllFilters"
        class="clear-btn"
      >
        Clear All
      </button>
    </div>

    <div class="filters-grid">
      <!-- Search Input -->
      <div class="filter-group">
        <label for="search">Search</label>
        <div class="search-input">
          <input
            id="search"
            type="text"
            :value="search"
            @input="updateSearch"
            placeholder="Search by name or email..."
            class="form-input"
          />
          <span class="search-icon">🔍</span>
        </div>
      </div>

      <!-- Role Filter -->
      <div class="filter-group">
        <label for="role">Role</label>
        <select
          id="role"
          :value="role"
          @change="updateRole"
          class="form-select"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="doctor">Doctor</option>
          <option value="nurse">Nurse</option>
        </select>
      </div>

      <!-- Department Filter -->
      <div class="filter-group">
        <label for="department">Department</label>
        <select
          id="department"
          :value="department"
          @change="updateDepartment"
          class="form-select"
        >
          <option value="">All Departments</option>
          <option value="cardiology">Cardiology</option>
          <option value="radiology">Radiology</option>
          <option value="surgery">Surgery</option>
          <option value="orthopedics">Orthopedics</option>
          <option value="pediatrics">Pediatrics</option>
          <option value="oncology">Oncology</option>
          <option value="emergency">Emergency</option>
        </select>
      </div>

      <!-- Status Filter -->
      <div class="filter-group">
        <!-- <label for="status">Status</label>
        <select
          id="status"
          :value="status"
          @change="updateStatus"
          class="form-select"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="on-leave">On Leave</option>
        </select> -->
      </div>
    </div>

    <!-- Filter Summary -->
    <div v-if="hasActiveFilters" class="filter-summary">
      <div class="active-filters">
        <span class="filter-tag" v-if="search">
          Search: "{{ search }}"
          <button @click="clearSearch">×</button>
        </span>
        <span class="filter-tag" v-if="role">
          Role: {{ role }}
          <button @click="clearRole">×</button>
        </span>
        <span class="filter-tag" v-if="department">
          Department: {{ department }}
          <button @click="clearDepartment">×</button>
        </span>
        <!-- <span class="filter-tag" v-if="status">
          Status: {{ status }}
          <button @click="clearStatus">×</button>
        </span> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  search: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: ''
  },
  department: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits([
  'update:search',
  'update:role', 
  'update:department',
  'update:status'
])

// Computed
const hasActiveFilters = computed(() => {
  return props.search || props.role || props.department || props.status
})

// Methods
const updateSearch = (event) => {
  emit('update:search', event.target.value)
}

const updateRole = (event) => {
  emit('update:role', event.target.value)
}

const updateDepartment = (event) => {
  emit('update:department', event.target.value)
}

const updateStatus = (event) => {
  emit('update:status', event.target.value)
}

// Clear individual filters
const clearSearch = () => emit('update:search', '')
const clearRole = () => emit('update:role', '')
const clearDepartment = () => emit('update:department', '')
const clearStatus = () => emit('update:status', '')

// Clear all filters
const clearAllFilters = () => {
  emit('update:search', '')
  emit('update:role', '')
  emit('update:department', '')
  emit('update:status', '')
}
</script>

<style scoped>
.staff-filters {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filters-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.clear-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s;
}

.clear-btn:hover {
  background: #c0392b;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
}

.search-input {
  position: relative;
}

.search-input input {
  padding-right: 2.5rem;
}

.search-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
  background: white;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-summary {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  gap: 0.5rem;
}

.filter-tag button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  padding: 0;
  margin-left: 0.25rem;
}

.filter-tag button:hover {
  opacity: 0.8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .filters-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}
</style>