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

      <!-- Role Selection -->
      <div class="form-group">
        <label for="role">Role:</label>
        <select id="role" v-model="formData.role" required>
          <option value="">Select Role</option>
          <option value="doctor">Doctor</option>
          <option value="nurse">Nurse</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <!-- Department - Hide for admin -->
      <div class="form-group" v-show="formData.role !== 'admin'">
        <label for="department">Department:</label>
        <select id="department" v-model="formData.department" :required="formData.role !== 'admin'">
          <option value="">Select Department</option>
          <option value="cardiology">Cardiology</option>
          <option value="radiology">Radiology</option>
          <option value="surgery">Surgery</option>
          <option value="orthopedics">Orthopedics</option>
          <option value="pediatrics">Pediatrics</option>
          <option value="oncology">Oncology</option>
          <option value="gastroenterology">Gastroenterology</option>
          <option value="endocrinology">Endocrinology</option>
          <option value="pulmonology">Pulmonology</option>
          <option value="dermatology">Dermatology</option>
          <option value="urology">Urology</option>
          <option value="gynecology">Gynecology</option>
          <option value="ophthalmology">Ophthalmology</option>
        </select>
      </div>

      <!-- Specialization - Hide for admin -->
      <div class="form-group" v-show="formData.role === 'doctor' || formData.role === 'nurse'">
        <label for="specialization">Specialization:</label>
        <select id="specialization" v-model="formData.specialization" :required="formData.role === 'doctor'">
          <option value="">Select Specialization</option>
          <option value="interventional_cardiology">Interventional Cardiology</option>
          <option value="electrophysiology">Electrophysiology</option>
          <option value="diagnostic_radiology">Diagnostic Radiology</option>
          <option value="interventional_radiology">Interventional Radiology</option>
          <option value="general_surgery">General Surgery</option>
          <option value="cardiothoracic_surgery">Cardiothoracic Surgery</option>
          <option value="orthopedic_surgery">Orthopedic Surgery</option>
          <option value="pediatric_orthopedics">Pediatric Orthopedics</option>
          <option value="pediatric_cardiology">Pediatric Cardiology</option>
          <option value="neonatology">Neonatology</option>
          <option value="medical_oncology">Medical Oncology</option>
          <option value="surgical_oncology">Surgical Oncology</option>
          <option value="hepatology">Hepatology</option>
          <option value="diabetes_management">Diabetes Management</option>
          <option value="sleep_medicine">Sleep Medicine</option>
          <option value="dermatopathology">Dermatopathology</option>
          <option value="endourology">Endourology</option>
          <option value="reproductive_endocrinology">Reproductive Endocrinology</option>
          <option value="retina_specialist">Retina Specialist</option>
        </select>
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

      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { signup } from '../../services/auth'

const router = useRouter();
const formData = ref({
  staff_id: '',
  staff_name: '',
  email: '',
  password: '',
  date_of_birth: '',
  role: '',
  department: '',
  specialization: '',
  shift_time: ''
})

// Handle role changes
watch(() => formData.value.role, (newRole) => {
  if (newRole === 'admin') {
    // For admin, set both department and specialization to "none"
    formData.value.department = 'none';
    formData.value.specialization = 'none';
  } else if (newRole !== 'doctor') {
    // For nurses, set specialization to "none" but keep department selection
    formData.value.specialization = 'none';
    if (formData.value.department === 'none') {
      formData.value.department = ''; // Reset department if it was previously set to "none"
    }
  } else {
    // For doctors, clear specialization to require selection
    formData.value.specialization = '';
    if (formData.value.department === 'none') {
      formData.value.department = ''; // Reset department if it was previously set to "none"
    }
  }
});

const submitForm = async () => {
  console.log('Form submitted:', formData.value)
  
  try {
    // Final check to ensure admin has department and specialization set to "none"
    if (formData.value.role === 'admin') {
      formData.value.department = 'none';
      formData.value.specialization = 'none';
    }
    // Make sure non-doctors have a specialization value
    else if (formData.value.role !== 'doctor' && !formData.value.specialization) {
      formData.value.specialization = 'none';
    }
    
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