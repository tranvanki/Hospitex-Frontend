<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>🏥 Hospital Management</h1>
        <p>Please sign in to your account</p>
      </div>

      <div class="login-form">
        <!-- ✅ ERROR MESSAGE -->
        <div v-if="error" class="error-message">
          ⚠️ {{ error }}
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="staff_name">Staff Name</label>
            <input 
              type="text" 
              id="staff_name" 
              v-model="formData.staff_name" 
              placeholder="Enter your staff name"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              v-model="formData.password" 
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            class="login-btn" 
            :disabled="loading"
          >
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <div class="login-footer">
          <p>Need an account? Contact your administrator</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/services/auth';

const router = useRouter();

const formData = ref({
  staff_name: '',
  password: ''
});

const loading = ref(false);
const error = ref('');

const handleSubmit = async () => {
  if (!formData.value.staff_name || !formData.value.password) {
    error.value = 'Please fill in all fields';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const result = await login(formData.value.staff_name, formData.value.password);
    
    console.log('Login result:', result);
    
    // ✅ Redirect based on role
    if (result.role === 'admin') {
      router.push('/admin-dashboard');
    } else if (result.role === 'doctor') {
      router.push('/doctor-dashboard');
    } else {
      router.push('/staff-list');
    }
    
  } catch (err) {
    console.error('Login failed:', err);
    error.value = err.response?.data?.message || 'Login failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.login-header {
  text-align: center;
  padding: 40px 30px 20px;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.login-header h1 {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 10px 0;
}

.login-header p {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

.login-form {
  padding: 30px;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  border: 1px solid #f5c6cb;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #495057;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 14px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #28a745;
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.login-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.login-footer {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.login-footer p {
  color: #6c757d;
  font-size: 14px;
  margin: 0;
}

@media (max-width: 480px) {
  .login-container {
    padding: 10px;
  }
  
  .login-form {
    padding: 20px;
  }
  
  .login-header {
    padding: 30px 20px 15px;
  }
}
</style>
