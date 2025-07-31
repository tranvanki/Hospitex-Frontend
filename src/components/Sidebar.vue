<template>
  <nav class="sidebar">
    <div class="sidebar-brand">
      <h2>Hospital System</h2>
    </div>
    
    <div class="sidebar-menu">
      <!-- Dynamic Navigation by Role -->
      <template v-if="role === 'admin'">
        <router-link to="/admin-dashboard">📊 Dashboard</router-link>
        <router-link to="/staff-list">🏥 Staff</router-link>
      </template>

      <template v-else-if="role === 'doctor'">
        <router-link to="/doctor-dashboard">📊 Dashboard</router-link>
        <router-link to="/patient-list">👥 Patients</router-link>
        <router-link to="/create-patient">➕ Add Patient</router-link>
        <router-link to="/vitals-list">❤️ Vitals</router-link>
        <router-link to="/record-list">📋 Records</router-link>
      </template>
    </div>
    
    <div class="sidebar-end">
      <select v-model="selectedLang" @change="changeLanguage">
        <option value="en">🇺🇸 English</option>
        <option value="vi">🇻🇳 Tiếng Việt</option>
      </select>
      <span class="staff-name">{{ staffName }}</span>
      <button class="logout-btn" @click="logout">Logout</button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      staffName: localStorage.getItem('staff_name') || 'Guest',
      role: localStorage.getItem('role') || '',
      selectedLang: localStorage.getItem('lang') || 'en'
    }
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push('/login');
    },
    changeLanguage() {
      localStorage.setItem('lang', this.selectedLang);
      // For now just update the storage, you'll need vue-i18n for real translations
      console.log(`Language changed to: ${this.selectedLang}`);
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;  /* ← VERTICAL layout! */
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
}

.sidebar-brand {
  padding: 1.5rem;
  border-bottom: 1px solid #34495e;
  text-align: center;
}

.sidebar-brand h2 {
  margin: 0;
  color: #3498db;
}

.sidebar-menu {
  flex: 1;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;  /* ← VERTICAL menu! */
}

.sidebar-menu a {
  color: white;
  text-decoration: none;
  padding: 1rem 1.5rem;
  display: block;
  transition: background 0.2s;
}

.sidebar-menu a:hover, 
.sidebar-menu a.router-link-active {
  background: #3498db;
  border-right: 3px solid #2980b9;
}

.sidebar-end {
  padding: 1rem;
  border-top: 1px solid #34495e;
  display: flex;
  flex-direction: column;  /* ← VERTICAL end section! */
  gap: 0.5rem;
}

.sidebar-end select {
  padding: 0.5rem;
  border-radius: 4px;
  border: none;
  background: white;
}

.staff-name {
  font-weight: bold;
  text-align: center;
  color: #ecf0f1;
}

.logout-btn {
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: #c0392b;
}
</style>