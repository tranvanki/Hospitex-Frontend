<template>
  <div class="admin-dashboard">
    <h1>Admin Dashboard</h1>
    <p>Welcome, {{ adminName }}. You can manage staff, patients, and other administrative tasks here.</p>

    <router-link to="/staff-list" class="ui button primary">
      📋 View Staff List
    </router-link>
    <router-link to="/signup" class="ui button secondary">
      ➕ Add New Staff
    </router-link>
    
    <button @click="logout" class="ui button secondary">
      🚪 Logout
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const adminName = ref('Admin User')

onMounted(async () => {
  const token = localStorage.getItem('token')
  try {
    const res = await axios.get('http://localhost:3001/staffs', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const adminUser = Array.isArray(res.data) 
      ? res.data.find(staff => staff.role === 'admin')
      : res.data
    
    adminName.value = adminUser?.staff_name || 'Admin User'
  } catch (err) {
    console.error('Error loading admin info:', err)
  }
})

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  localStorage.removeItem('userId')
  
  alert('Logged out successfully!')
  router.push('/')
}
</script>

<style scoped>
.admin-dashboard {
  padding: 2rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.ui.button {
  margin-right: 1rem;
  margin-top: 1rem;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s;
}

.ui.button.primary {
  background: #007bff;
  color: white;
}

.ui.button.secondary {
  background: #6c757d;
  color: white;
}

.ui.button:hover {
  transform: translateY(-1px);
  opacity: 0.9;
}

button.ui.button {
  border: none;
  font-family: inherit;
}
</style>
