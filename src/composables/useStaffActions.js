// Quản lý reactive state + UI logic → biết khi nào loading, lỗi, cập nhật danh sách
// Không phải “2 await” — mà là 2 lớp xử lý bất đồng bộ (async) ở 2 tầng kiến trúc khác nhau, mỗi tầng có mục đích riêng. 
import { ref, computed } from 'vue'
import { getAllStaff,updateStaff, deleteStaff } from '@/services/staffs.js'


export function useStaffData() {
  const staffList = ref([])
  const loading = ref(false)
  const error = ref(null)



  const fetchStaff = async () => {
    try {
      loading.value = true
      error.value = null
      
      staffList.value = await getAllStaff()
      
    } catch (err) {
      console.error('Failed to fetch staff:', err)
      error.value = 'Unable to load staff data. Please try again.'
      notify?.error('Failed to load staff') // Optional notification
    } finally {
      loading.value = false
    }
  }

  return {
    staffList,
    loading,
    error,
    staffStats,
    fetchStaff
  }
}

export function useStaffActions(){
    const actionLoading = ref({
        delete: false,
        update: false,
        create: false
    })
    const deletedStaffMember = async (staffId) =>{
        try {
            actionLoading.value.delete = true
            await deleteStaff(staffId)
            // Success handling without notification
            return { success: true }
        } catch (error) {
            console.error('Failed to delete staff:', error)
            return { success: false, error }
        } finally {
            actionLoading.value.delete = false
        }
    }
    const updateStaffMember = async (staffId, data) => {
        try{
            actionLoading.value.update = true
            await updateStaff(staffId, data)
            // Success handling without notification
            return { success: true }
        } catch (error) {
            console.error('Failed to update staff:', error)
            return { success: false, error }
        } finally {
            actionLoading.value.update = false;
        }
    }
    return{
        actionLoading,
        deletedStaffMember,
        updateStaffMember
    }
}
