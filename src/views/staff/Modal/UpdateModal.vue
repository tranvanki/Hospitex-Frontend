<template>
<div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
        <div class="modal-header">
            <h2>{{ item ? 'Edit Staff' : 'Add Staff' }}</h2>
            <button class="close-btn" @click="$emit('close')">&times;</button>
        </div>
        <div class="modal-body">
            <form @submit.prevent="submitForm">
                <div class="form-group">
                    <label for="staff_name">Name</label>
                    <input type="text" id="staff_name" 
                    v-model="formData.staff_name" required />
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" 
                    v-model="formData.email" required />
                </div>
                <div class="form-group">
                    <label for="phone">Phone</label>
                    <input type="tel" id="phone" 
                    v-model="formData.phone" />
                </div>
                <div class="form-group">
                    <label for="role">Role</label>
                    <select id="role" v-model="formData.role" required>
                        <option value="doctor">Doctor</option>
                        <option value="nurse">Nurse</option>
                        <option value="admin">Admin</option>
                        <option value="staff">Receptionist</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="department">Department</label>
                    <select id="department" v-model="formData.department">
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
                <div class="form-group" v-if="formData.role === 'doctor'">
                    <label for="specialization">Specialization</label>
                    <select id="specialization" v-model="formData.specialization">
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
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn-secondary" @click="$emit('close')">Cancel</button>
            <button class="btn-primary" @click="submitForm" :disabled="saving">
                {{ saving ? 'Saving...' : 'Save' }}
            </button>
        </div>
    </div>
</div>
</template>
<script setup>
    import { ref, watch, onMounted } from 'vue';

    const props = defineProps({
        show: {
            type: Boolean,
            required: true
        },
        item: {
            type: Object,
            default: () => null
        }
    });
   const emit = defineEmits(['close','save']);

   const saving = ref(false);
   const formData = ref({
        staff_name: '',
        email: '',
        role: 'staff',
        phone: '',
        date_of_birth: '',
        specialization: '',
        department: ''
   });

   // Initialize form data when component mounts or when item changes
   const initializeForm = () => {
       if (props.item) {
           formData.value = {
               staff_name: props.item.staff_name || '',
               email: props.item.email || '',
               role: props.item.role || 'staff',
               phone: props.item.phone || '',
               date_of_birth: props.item.date_of_birth || '',
               specialization: props.item.specialization || '',
               department: props.item.department || ''
           };
       } else {
           // Reset form for new staff
           formData.value = {
               staff_name: '',
               email: '',
               role: 'staff',
               phone: '',
               date_of_birth: '',
               specialization: '',
               department: ''
           };
       }
   };

   onMounted(() => {
       initializeForm();
   });

   watch(() => props.item, () => {
       initializeForm();
   });

   watch(() => props.show, (newVal) => {
       if (newVal) {
           initializeForm();
       }
   });

   const submitForm = async () => {
       try {
           saving.value = true;
           emit('save', {...formData.value});
       } catch (error) {
           console.error("Error saving staff:", error);
       } finally {
           saving.value = false;
       }
   };
</script>
<style> 
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 550px;
  max-width: 90vw;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
.btn-primary:disabled {
  background: #7fc4e8;
  cursor: not-allowed;
}
</style>