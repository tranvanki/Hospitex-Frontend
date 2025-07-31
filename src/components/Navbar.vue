<template>
  <nav class="navbar">
    <h2>Hospital System</h2>
    <div class="navbar-right">
      <span>Welcome, {{ staffName }}</span>
      <button @click="logout">Logout</button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',

  data() {
    return {
      staffName: localStorage.getItem('staff_name') || 'Guest'
    }
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #2185d0;
  color: white;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

button {
  background: #fff;
  color: #2185d0;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

button:hover {
  background: #f0f0f0;
}
</style>
