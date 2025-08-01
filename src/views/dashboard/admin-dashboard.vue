<template>
  <div class="admin-dashboard">
    <h1>Admin Dashboard</h1>
    <p>Welcome, {{ adminName }}. You can manage staff, patients, and other administrative tasks here.</p>

    <router-link to="/staff-list" class="ui button primary">
      📋 View Staff List
    </router-link>
    <router-link to="/add-staff" class="ui button secondary">
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
import { getCurrentUser, logout as authLogout } from '@/services/auth'

const router = useRouter()
const adminName = ref('Admin User')

onMounted(() => {
  // ✅ SỬA: Dùng getCurrentUser từ auth.js
  const user = getCurrentUser()
  
  if (user) {
    adminName.value = user.name || user.staff_name || 'Admin User'
    console.log('✅ Admin user loaded:', user)
  } else {
    console.log('❌ No user found, redirecting to login')
    router.push('/login')
  }
})

const logout = () => {
  authLogout()  // ✅ Dùng logout từ auth.js
  alert('Logged out successfully!')
  router.push('/login')
}
</script>

<!-- ...existing styles... -->
