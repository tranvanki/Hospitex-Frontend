<template>
  <div id="app">
    <!-- Only show the navbar once when logged in -->
    <Navbar v-if="isLoggedIn" />
    
    <!-- Main content area with proper layout -->
    <div class="main-container" v-if="isLoggedIn">
      <!-- Sidebar for all logged-in users -->
      <Sidebar class="sidebar" />
      
      <main class="main-content">
        <router-view />
      </main>   
    </div>
    
    <!-- For guest users, just show router view -->
    <router-view v-if="!isLoggedIn" />  
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'
export default {
  name: 'App',
  components: {
    Navbar,
    Sidebar
  },
  data() {
    return {
      isLoggedIn: false
    }
  },
  created() {
    this.checkLoginStatus()
    
    // Also check when route changes
    this.$router.beforeEach((to, from, next) => {
      this.checkLoginStatus()
      next()
    })
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token')
      this.isLoggedIn = !!token
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.main-container {
  display: flex;
  min-height: 100vh; /* ← Changed from calc(100vh - 60px) */
  padding-top: 60px; /* ← Add padding for fixed navbar */
}


.sidebar{
  width: 240px; /* ← Fixed width for sidebar */
  background-color: #2c3e50;
  color: white;
  position: fixed;
  top: 60px; /* ← Adjusted for fixed navbar height */
  bottom: 0;
  overflow-y: auto; /* ← Allow scrolling if content overflows */  
  float: left;
}
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px; /* ← Define navbar height */
  z-index: 1000;
}

.main-content {
  flex: 1;
  margin-left: 240px; /* ← Add margin to avoid sidebar overlap */
  padding: 20px;
  overflow-x: hidden;
  min-height: calc(100vh - 60px);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%); /* ← Hide sidebar on mobile */
  }
  
  .main-content {
    margin-left: 0; /* ← Remove margin on mobile */
  }
}
</style>
