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
