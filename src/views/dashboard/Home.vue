<template>
  <div class="home">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Hospital Management System</h1>
        <p class="hero-subtitle">
          Comprehensive healthcare management solution for medical professionals
        </p>
        
        <div class="auth-buttons">
          <router-link to="/login" class="btn btn-primary">
            <span class="btn-icon">🔐</span>
            Login
          </router-link>
          
          <router-link to="/signup" class="btn btn-secondary">
            <span class="btn-icon">📝</span>
            Sign Up
          </router-link>
        </div>
      </div>
      
      <div class="hero-image">
        <div class="medical-icon">🏥</div>
      </div>
    </div>
    
    <div class="features-section">
      <h2>Our Services</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">👨‍⚕️</div>
          <h3>Doctor Management</h3>
          <p>Manage doctor profiles, schedules, and patient assignments</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">👥</div>
          <h3>Patient Records</h3>
          <p>Comprehensive patient information and medical history</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">❤️</div>
          <h3>Vital Signs</h3>
          <p>Track and monitor patient vital signs and health metrics</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">📋</div>
          <h3>Medical Records</h3>
          <p>Digital medical records and treatment documentation</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No need for complex logic in home page
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, green 100%);
}

.hero-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  min-height: 100vh;
  padding: 0 50px;
  gap: 50px;
}

.hero-content {
  color: white;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 40px;
  opacity: 0.9;
  line-height: 1.6;
}

.auth-buttons {
  display: flex;
  gap: 20px;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 15px 30px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.btn-icon {
  margin-right: 10px;
  font-size: 1.2em;
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-primary:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.btn-secondary {
  background: transparent;
  color: white;
  border-color: white;
}

.btn-secondary:hover {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.medical-icon {
  font-size: 15rem;
  opacity: 0.3;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.features-section {
  background: white;
  padding: 80px 50px;
  text-align: center;
}

.features-section h2 {
  font-size: 2.5rem;
  margin-bottom: 50px;
  color: #343a40;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  padding: 30px;
  border-radius: 15px;
  background: #f8f9fa;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #343a40;
}

.feature-card p {
  color: #6c757d;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero-section {
    grid-template-columns: 1fr;
    padding: 20px;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .features-section {
    padding: 50px 20px;
  }
  
  .auth-buttons {
    justify-content: center;
  }
}
</style>