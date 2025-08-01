<template>
  <div class="add-staff-container">
    <div class="add-staff-card">
      <div class="page-header">
        <div class="breadcrumb">
          <router-link to="/staff-list" class="breadcrumb-link">👥 Staff</router-link>
          <span class="breadcrumb-separator">→</span>
          <span class="breadcrumb-current">Add New Staff</span>
        </div>
        <h1 class="page-title">Add New Staff Member</h1>
      </div>

      <div class="form-container">
        <form @submit.prevent="handleSubmit">
          <div class="form-grid">
            <div class="form-group">
              <label for="staff_name">Full Name *</label>
              <input 
                type="text" 
                id="staff_name" 
                v-model="formData.staff_name" 
                required
              />
            </div>

            <div class="form-group">
              <label for="email">Email *</label>
              <input 
                type="email" 
                id="email" 
                v-model="formData.email" 
                required
              />
            </div>

            <div class="form-group">
              <label for="password">Password *</label>
              <input 
                type="password" 
                id="password" 
                v-model="formData.password" 
                required
                minlength="6"
              />
            </div>

            <div class="form-group">
              <label for="role">Role *</label>
              <select id="role" v-model="formData.role" required>
                <option value="">Select Role</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                v-model="formData.phone"
              />
            </div>

            <div class="form-group">
              <label for="department">Department</label>
              <input 
                type="text" 
                id="department" 
                v-model="formData.department"
              />
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              <span v-if="submitting">Creating...</span>
              <span v-else>Create Staff Member</span>
            </button>
            <button 
              type="button" 
              @click="$router.push('/staff-list')"
              class="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signup } from '@/services/auth';

const router = useRouter();

const formData = ref({
  staff_name: '',
  email: '',
  password: '',
  role: '',
  phone: '',
  department: ''
});

const submitting = ref(false);

const handleSubmit = async () => {
  submitting.value = true;
  
  try {
    await signup(formData.value);
    alert('Staff member created successfully!');
    router.push('/staff-list');
  } catch (error) {
    console.error('Error creating staff:', error);
    alert(error.response?.data?.message || 'Failed to create staff member');
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.add-staff-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 20px;
  background-color: #f8f9fa;
}

.add-staff-card {
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.page-header {
  padding: 30px;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.breadcrumb {
  font-size: 14px;
  margin-bottom: 10px;
  opacity: 0.9;
}

.breadcrumb-link {
  color: white;
  text-decoration: none;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  margin: 0 8px;
}

.breadcrumb-current {
  opacity: 0.8;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin: 0;
}

.form-container {
  padding: 30px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #495057;
  font-size: 14px;
}

.form-group input,
.form-group select {
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #28a745;
}

.form-actions {
  display: flex;
  gap: 15px;
  border-top: 1px solid #e9ecef;
  padding-top: 30px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 16px;
}

.btn-primary {
  background: #28a745;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #218838;
}

.btn-primary:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>
