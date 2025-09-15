<template>
  <div class="staff-container">
    <StaffHeader @add-staff="navigateToAdd" />
    
    <StaffFilters
      v-model:search="filters.search"
      v-model:role="filters.role"
      v-model:department="filters.department"
      v-model:status="filters.status"
    />
    
    <LoadingSpinner v-if="loading" />
    <ErrorMessage v-else-if="error" :message="error" @dismiss="error = null" />
    
    <div v-else>
      <!-- Update to use our imported component -->
      <div class="stats-summary">
        <div class="stats-card">
          <h3>Total Staff</h3>
          <p class="stat-value">{{ statsData.total }}</p>
        </div>
        <div class="stats-card">
          <h3>Doctors</h3>
          <p class="stat-value">{{ statsData.doctors }}</p>
        </div>
        <div class="stats-card">
          <h3>Nurses</h3>
          <p class="stat-value">{{ statsData.nurses }}</p>
        </div>
        <div class="stats-card">
          <h3>Admins</h3>
          <p class="stat-value">{{ statsData.admins }}</p>
        </div>
      </div>
      
      <StaffGrid
        :staff-list="filteredStaff"
        :loading="loading"
        @clearFilters="clearAllFilters"
        @edit="handleEditClick"
        @delete="handleDeleteClick"
      />
      
      <EmptyState 
        v-if="filteredStaff.length === 0 && !loading" 
        title="No staff found"
        description="Try adjusting your filters to see more results."
        actionText="Clear Filters"
        @action="clearAllFilters"
      />
    </div>

    <!-- Modals -->
    <DeleteModal
      v-if="showDeleteModal"
      :show="showDeleteModal"
      :item="selectedStaff"
      title="Delete Staff"
      description="Are you sure you want to delete this staff member? This action cannot be undone."
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />
    
    <UpdateModal
      :show="showUpdateModal"
      :item="selectedStaff"
      @close="showUpdateModal = false"
      @save="saveStaffUpdate"
    />
  </div>
</template>

<script setup>
// Vue core imports
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

// Component imports
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import StaffFilters from '@/components/StaffFilters.vue';
import StaffGrid from '@/components/staff/StaffGrid.vue';
import StaffHeader from '@/components/staff/StaffHeader.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import ErrorMessage from '@/components/ui/ErrorMessage.vue';

// Modal imports
import DeleteModal from './Modal/DeleteModal.vue';
import UpdateModal from './Modal/UpdateModal.vue';

// Composables
import { useStaffData } from '@/composables/useStaffData';
import { useStaffActions } from '@/composables/useStaffActions';
import { useStaffFilters } from '@/composables/useStaffFilters';

// Router
const router = useRouter();

// Staff data management
const { staffList, loading, error, fetchStaff } = useStaffData();
const { deletedStaffMember, updateStaffMember } = useStaffActions();
const { filters, filteredStaff, clearFilters: clearAllFilters } = useStaffFilters(staffList);

// Computed stats with null check
const statsData = computed(() => {
  if (!staffList.value) return { total: 0, doctors: 0, nurses: 0, admins: 0 };
  
  return {
    total: staffList.value.length,
    doctors: staffList.value.filter(s => s.role === 'doctor').length,
    nurses: staffList.value.filter(s => s.role === 'nurse').length,
    admins: staffList.value.filter(s => s.role === 'admin').length
  };
});

// Modal state management
const showDeleteModal = ref(false);
const showUpdateModal = ref(false);
const selectedStaff = ref(null);

// Navigation
const navigateToAdd = () => {
  router.push({name: 'AddStaff'});
};

// Modal handlers
const handleDeleteClick = (staff) => {
  selectedStaff.value = staff;
  showDeleteModal.value = true;
};

const handleEditClick = (staff) => {
  selectedStaff.value = staff;
  showUpdateModal.value = true;
};

// CRUD operations
const confirmDelete = async () => {
  try {
    await deletedStaffMember(selectedStaff.value._id);
    await fetchStaff();
    showDeleteModal.value = false;
    selectedStaff.value = null;
  } catch (error) {
    console.error('Failed to delete staff:', error);
  }
};

const saveStaffUpdate = async (updatedData) => {
  try {
    console.log("Updating staff with data:", updatedData);
    const result = await updateStaffMember(selectedStaff.value._id, updatedData);
    
    if (result.success) {
      await fetchStaff();
      showUpdateModal.value = false;
      selectedStaff.value = null;
    } else {
      console.error("Update failed:", result.error);
      // You might want to show an error message to the user here
    }
  } catch (error) {
    console.error('Failed to update staff:', error);
  }
};

// Initialize
onMounted(() => {
  fetchStaff();
});
</script>

<style scoped>
.staff-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: #f8f9fa;
  min-height: 100vh;
}

.stats-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stats-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stats-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #6b7280;
}

.stat-value {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
  color: #1f2937;
}
</style>