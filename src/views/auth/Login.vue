<template>
  <div class="login-form">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="staff_name">Username:</label>
        <input type="text" id="staff_name" v-model="staff_name" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit" >Login</button>
    </form>
  </div>
</template>
<script>
import router from '@/router';
import { login } from '@/services/auth.js';

export default {
  name: 'Login',
  data() {
    return {
      staff_name: '',
      password: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        const { token, role } = await login(this.staff_name, this.password);
        alert('Login successful!');
        if (role === 'admin') {
          router.push('/admin-dashboard');
        } else if (role === 'doctor') {
          router.push('/doctor-dashboard');
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error(error);
        alert('Login failed!');
      }
    }
  }
};
</script>

<style scope>
button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover{
background-color: aquamarine;
}
.form-group {
  margin-bottom: 1rem;
}
.login-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: Georgia, 'Times New Roman';
}
</style>