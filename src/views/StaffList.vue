<template>
  <div class="staff-container">
    <!-- ✅ THÊM HEADER VỚI NÚT ADD STAFF -->
    <div class="staff-header">
      <div>
        <h1>👥 Staff Management</h1>
        <p>Manage hospital staff members and their roles</p>
      </div>
      <!-- ✅ THÊM NÚT ADD NEW STAFF -->
      <router-link to="/add-staff" class="btn btn-primary">
        ➕ Add New Staff
      </router-link>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading staff data...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <button @click="fetchStaffData" class="retry-btn">Try Again</button>
    </div>
    
    <!-- ...existing staff grid code... -->
    
  </div>
</template>

<script setup>
// ...existing script code...
</script>

<style scoped>
/* ✅ UPDATE STAFF HEADER STYLES */
.staff-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.staff-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.staff-header p {
  color: #6c757d;
  font-size: 1.1rem;
  margin: 0;
}

/* ✅ ADD BUTTON STYLES */
.btn {
  display: inline-block;
  padding: 12px 24px;
  background: #28a745;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: #28a745;
}

.btn:hover {
  background: #218838;
  transform: translateY(-1px);
}

/* ...existing styles... */
</style>
