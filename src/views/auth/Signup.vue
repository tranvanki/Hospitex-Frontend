<template>
  <div class="signup-form">
    <h2>Sign Up</h2>
    <form @submit.prevent="submitForm">
      <!-- Basic Info -->
      <div class="form-group">
        <label for="staff_id">Staff ID:</label>
        <input type="text" id="staff_id" v-model="formData.staff_id" required />
      </div>

      <div class="form-group">
        <label for="staff_name">Username:</label>
        <input type="text" id="staff_name" v-model="formData.staff_name" required />
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="formData.email" required />
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          v-model="formData.password"
          required
        />
      </div>

      <div class="form-group">
        <label for="date_of_birth">Date of Birth:</label>
        <input
          type="date"
          id="date_of_birth"
          v-model="formData.date_of_birth"
          required
        />
      </div>

      <!-- Additional Info -->
      <div class="form-group">
        <label for="department">Department:</label>
        <input
          type="text"
          id="department"
          v-model="formData.department"
          required
        />
      </div>

      <div class="form-group">
        <label for="specialization">Specialization:</label>
        <input
          type="text"
          id="specialization"
          v-model="formData.specialization"
          required
        />
      </div>

      <div class="form-group">
        <label for="shift_time">Shift Time:</label>
        <select id="shift_time" v-model="formData.shift_time" required>
          <option value="">Select Shift</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Night">Night</option>
        </select>
      </div>

      <div class="form-group">
        <label for="role">Role:</label>
        <input type="text" id="role" v-model="formData.role" required />
      </div>

      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signup } from '../../services/auth'
const router = useRouter();
const formData = ref({
  staff_id: '',
  staff_name: '',
  email: '',
  password: '',
  date_of_birth: '',
  department: '',
  specialization: '',
  shift_time: '',
  role: ''
})

const submittedData = ref(null)

const submitForm = async () => {
  console.log('Form submitted:', formData.value)
  submittedData.value = { ...formData.value }
  
  try {
    const response = await signup(formData.value)
    console.log('Signup response:', response)
    alert('Signup successful! Redirecting to login...')
    router.push('/login')
    
  } catch (err) {
    console.error('Signup error:', err)
    
    // Better error handling
    if (err.response) {
      // Server responded with error status
      console.error('Error response:', err.response.data)
      alert(`Signup failed: ${err.response.data.message || err.response.data.error || 'Server error'}`)
    } else if (err.request) {
      // Request was made but no response received
      console.error('No response received:', err.request)
      alert('Signup failed: Cannot connect to server. Please check your internet connection.')
    } else {
      // Something else happened
      console.error('Request error:', err.message)
      alert(`Signup failed: ${err.message}`)
    }
  }
}
</script>

<style scoped>
.signup-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: Arial, sans-serif;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

input,
select {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 4px;
    
  border: 1px solid #ccc;
}

button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #36976b;
}

.submitted-data {
  margin-top: 1rem;
  background-color: #f0f0f0;
  padding: 1rem;
  border-radius: 4px;
}
</style>