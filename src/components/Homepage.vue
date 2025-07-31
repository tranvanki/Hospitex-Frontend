
<template>
  <div class="home">
    <h2>Welcome to the Home Page</h2>
    <p>This is the main page of our application.</p>
  </div>
</template>

<script>
import { ref } from 'vue';
import Navbar from '@/components/Navbar.vue';
import Sidebar from '@/components/Sidebar.vue';
const email = ref('');
export default {
  name: 'Home',
  msg: String
}
</script>