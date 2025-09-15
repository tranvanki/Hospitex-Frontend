import { ref } from 'vue'
import { getAllStaff } from '@/services/staffs.js'

export function useStaffData() {
  const staffList = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchStaff = async () => {
    loading.value = true
    error.value = null
    
    try {
      console.log('Fetching staff data...')
      const response = await getAllStaff()
      console.log('API response:', response)
      
      // Check if response is the actual data array or if data is nested
      if (Array.isArray(response)) {
        staffList.value = response
      } else if (response && response.data && Array.isArray(response.data)) {
        staffList.value = response.data
      } else if (response && typeof response === 'object') {
        // If response is an object with unknown structure, try to find an array
        const possibleDataArray = Object.values(response).find(val => Array.isArray(val))
        if (possibleDataArray) {
          staffList.value = possibleDataArray
        } else {
          console.error('Could not find staff array in response:', response)
          error.value = 'Invalid data format from server'
        }
      } else {
        console.error('Unexpected response format:', response)
        error.value = 'Server returned invalid data'
      }
      
      console.log('Staff data loaded, count:', staffList.value.length)
    } catch (err) {
      console.error('Error fetching staff:', err)
      error.value = 'Failed to load staff data. Please try again.'
    } finally {
      loading.value = false
    }
  }

  // Remove the onMounted call from here - it should only be called in the component

  return {
    staffList,
    loading,
    error,
    fetchStaff
  }
}