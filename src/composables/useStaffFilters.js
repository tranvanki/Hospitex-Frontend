import { ref, computed } from 'vue'

// Simple debounce function instead of using lodash-es
function debounce(fn, delay) {
  let timeoutId
  return function(...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}

export function useStaffFilters(staffList) {
  const filters = ref({
    search: '',
    role: '',
    department: '',
    status: ''
  })

  // Apply all filters to the staff list
  const filteredStaff = computed(() => {
    if (!staffList.value) return []
    
    return staffList.value.filter(staff => {
      // Search filter
      const searchMatch = !filters.value.search || 
        staff.name?.toLowerCase().includes(filters.value.search.toLowerCase()) || 
        staff.email?.toLowerCase().includes(filters.value.search.toLowerCase())
      
      // Role filter
      const roleMatch = !filters.value.role || staff.role === filters.value.role
      
      // Department filter
      const departmentMatch = !filters.value.department || staff.department === filters.value.department
      
      // Status filter
      const statusMatch = !filters.value.status || staff.status === filters.value.status
      
      return searchMatch && roleMatch && departmentMatch && statusMatch
    })
  })

  // Debounced search update
  const updateSearch = debounce((value) => {
    filters.value.search = value
  }, 300)

  // Clear all filters
  const clearFilters = () => {
    filters.value.search = ''
    filters.value.role = ''
    filters.value.department = ''
    filters.value.status = ''
  }

  return {
    filters,
    filteredStaff,
    updateSearch,
    clearFilters
  }
}