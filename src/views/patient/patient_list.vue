<template>
  <div>
    <Navbar />
    <div class="patient-list-container">
      <div class="page-header">
        <div class="header-content">
          <div class="breadcrumb">
            <router-link to="/dashboard" class="breadcrumb-link">Dashboard</router-link>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">My Patients</span>
          </div>
          <h1 class="page-title">My Patients</h1>
          <p class="page-subtitle">Manage and view your assigned patients</p>
        </div>
        
        <!-- Action buttons -->
        <div class="header-actions">
          <router-link to="/create-patient" class="btn btn-primary">
            <span class="btn-icon">+</span>
            Add New Patient
          </router-link>
          <button class="btn btn-secondary" @click="refreshPatients">
            <span class="btn-icon">🔄</span>
            Refresh
          </button>
        </div>
      </div>

      <div class="content-area">
        <!-- Loading state -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <span class="loading-text">Loading patients...</span>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="error-state">
          <div class="error-icon">⚠️</div>
          <div class="error-content">
            <h3>Error Loading Patients</h3>
            <p>{{ error }}</p>
            <button @click="refreshPatients" class="btn btn-outline">Try Again</button>
          </div>
        </div>

        <!-- Main content -->
        <div v-else class="patients-content">
          <!-- Stats summary -->
          <div class="stats-summary">
            <div class="stat-card">
              <div class="stat-icon patients-icon">👥</div>
              <div class="stat-info">
                <div class="stat-number">{{ patients.length }}</div>
                <div class="stat-label">Total Patients</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon active-icon">🟢</div>
              <div class="stat-info">
                <div class="stat-number">{{ activePatients }}</div>
                <div class="stat-label">Active Cases</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon discharged-icon">✅</div>
              <div class="stat-info">
                <div class="stat-number">{{ dischargedPatients }}</div>
                <div class="stat-label">Discharged</div>
              </div>
            </div>
          </div>

          <!-- Patients table -->
          <div class="patients-table-container">
            <div class="table-header">
              <h3>Patient List</h3>
              <div class="table-actions">
                <input 
                  type="text" 
                  placeholder="Search patients..." 
                  class="search-input"
                  v-model="searchQuery"
                >
                <select class="filter-select" v-model="statusFilter">
                  <option value="">All Status</option>
                  <option value="Admitted">Admitted</option>
                  <option value="Discharged">Discharged</option>
                  <option value="Under Treatment">Under Treatment</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
            </div>

            <div class="patients-table">
              <!-- Table header -->
              <div class="table-row table-header-row">
                <div class="table-cell">Patient Info</div>
                <div class="table-cell">Contact</div>
                <div class="table-cell">Medical Info</div>
                <div class="table-cell">Status</div>
                <div class="table-cell">Actions</div>
              </div>

              <!-- Patient rows -->
              <router-link
                v-for="patient in filteredPatients"
                :key="patient._id"
                :to="`/patient-details/${patient._id}`"
                class="table-row patient-row"
              >
                <div class="table-cell patient-info">
                  <div class="patient-avatar">
                    {{ patient.patient_name?.charAt(0)?.toUpperCase() }}
                  </div>
                  <div class="patient-details">
                    <div class="patient-name">{{ patient.patient_name }}</div>
                    <div class="patient-id">ID: {{ patient.patient_id }}</div>
                    <div class="patient-age">{{ calculateAge(patient.date_of_birth) }} years old</div>
                  </div>
                </div>

                <div class="table-cell contact-info">
                  <div class="contact-item">
                    <span class="contact-icon">📞</span>
                    {{ patient.phone_num }}
                  </div>
                  <div class="contact-item">
                    <span class="contact-icon">✉️</span>
                    {{ patient.email }}
                  </div>
                </div>

                <div class="table-cell medical-info">
                  <div class="medical-item">
                    <span class="medical-label">History:</span>
                    <span class="medical-value">{{ truncateText(patient.medical_history, 30) }}</span>
                  </div>
                  <div class="medical-item">
                    <span class="medical-label">Gender:</span>
                    <span class="medical-value">{{ patient.gender }}</span>
                  </div>
                </div>

                <div class="table-cell status-cell">
                  <span :class="['status-badge', getStatusClass(patient.discharge_status)]">
                    {{ patient.discharge_status }}
                  </span>
                </div>

                <div class="table-cell actions-cell" @click.prevent>
                  <button class="action-btn view-btn" @click="viewPatient(patient._id)">
                    👁️ View
                  </button>
                  <button class="action-btn edit-btn" @click="editPatient(patient._id)">
                    ✏️ Edit
                  </button>
                </div>
              </router-link>
            </div>

            <!-- Empty state -->
            <div v-if="filteredPatients.length === 0" class="empty-state">
              <div class="empty-icon">📋</div>
              <h3>No Patients Found</h3>
              <p v-if="searchQuery || statusFilter">
                No patients match your current filters.
                <button @click="clearFilters" class="clear-filters-btn">Clear filters</button>
              </p>
              <p v-else>
                You don't have any patients assigned yet.
                <router-link to="/create-patient" class="add-patient-link">Add your first patient</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import { getMyPatients } from '@/services/patients.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const patients = ref([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const statusFilter = ref('')

// Computed properties
const activePatients = computed(() => 
  patients.value.filter(p => p.discharge_status !== 'Discharged').length
)

const dischargedPatients = computed(() => 
  patients.value.filter(p => p.discharge_status === 'Discharged').length
)

const filteredPatients = computed(() => {
  let filtered = patients.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(patient => 
      patient.patient_name?.toLowerCase().includes(query) ||
      patient.patient_id?.toLowerCase().includes(query) ||
      patient.email?.toLowerCase().includes(query)
    )
  }

  // Filter by status
  if (statusFilter.value) {
    filtered = filtered.filter(patient => 
      patient.discharge_status === statusFilter.value
    )
  }

  return filtered
})

// Methods
const loadPatients = async () => {
  try {
    loading.value = true
    error.value = ''
    patients.value = await getMyPatients()
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load patients.'
  } finally {
    loading.value = false
  }
}

const refreshPatients = () => {
  loadPatients()
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
}

const calculateAge = (birthDate) => {
  if (!birthDate) return 'N/A'
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

const truncateText = (text, length) => {
  if (!text) return 'N/A'
  return text.length > length ? text.substring(0, length) + '...' : text
}

const getStatusClass = (status) => {
  switch (status) {
    case 'Admitted': return 'status-admitted'
    case 'Discharged': return 'status-discharged'
    case 'Under Treatment': return 'status-treatment'
    case 'Emergency': return 'status-emergency'
    case 'Outpatient': return 'status-outpatient'
    default: return 'status-default'
  }
}

const viewPatient = (patientId) => {
  router.push(`/patient-details/${patientId}`)
}

const editPatient = (patientId) => {
  router.push(`/edit-patient/${patientId}`)
}

onMounted(() => {
  loadPatients()
})
</script>

<style scoped>
.patient-list-container {
  min-height: 100vh;
  background: #f8fafc;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  margin-bottom: 2rem;
}

.header-content {
  margin-bottom: 1.5rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 14px;
}

.breadcrumb-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: white;
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  color: rgba(255, 255, 255, 0.6);
}

.breadcrumb-current {
  color: white;
  font-weight: 500;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.btn-primary {
  background: #fff;
  color: #667eea;
}

.btn-primary:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
}

.content-area {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Loading state */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  gap: 1rem;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1.1rem;
  color: #6b7280;
}

/* Error state */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem;
  text-align: center;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-content h3 {
  color: #dc2626;
  margin-bottom: 0.5rem;
}

.error-content p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

/* Stats summary */
.stats-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.patients-icon { background: #dbeafe; }
.active-icon { background: #dcfce7; }
.discharged-icon { background: #f0fdf4; }

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Patients table */
.patients-table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.table-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input, .filter-select {
  padding: 0.5rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.search-input:focus, .filter-select:focus {
  outline: none;
  border-color: #667eea;
}

.patients-table {
  display: flex;
  flex-direction: column;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 2fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s;
  text-decoration: none;
  color: inherit;
}

.table-header-row {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.patient-row:hover {
  background: #f8fafc;
}

.table-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.patient-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.patient-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;
}

.patient-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.patient-name {
  font-weight: 600;
  color: #1f2937;
}

.patient-id, .patient-age {
  font-size: 0.875rem;
  color: #6b7280;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.medical-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.medical-item {
  display: flex;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.medical-label {
  font-weight: 500;
  color: #6b7280;
}

.medical-value {
  color: #1f2937;
}

.status-cell {
  justify-content: center;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-admitted { background: #dbeafe; color: #1e40af; }
.status-discharged { background: #dcfce7; color: #166534; }
.status-treatment { background: #fef3c7; color: #92400e; }
.status-emergency { background: #fecaca; color: #991b1b; }
.status-outpatient { background: #e0e7ff; color: #3730a3; }
.status-default { background: #f3f4f6; color: #374151; }

.actions-cell {
  gap: 0.5rem;
}

.action-btn {
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.view-btn {
  background: #e0e7ff;
  color: #3730a3;
}

.view-btn:hover {
  background: #c7d2fe;
}

.edit-btn {
  background: #fef3c7;
  color: #92400e;
}

.edit-btn:hover {
  background: #fde68a;
}

/* Empty state */
.empty-state {
  padding: 4rem;
  text-align: center;
  color: #6b7280;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  color: #374151;
}

.clear-filters-btn, .add-patient-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
}

.clear-filters-btn:hover, .add-patient-link:hover {
  text-decoration: underline;
}

/* Responsive design */
@media (max-width: 1024px) {
  .table-row {
    grid-template-columns: 2fr 1fr 1fr;
  }
  
  .contact-info, .medical-info {
    display: none;
  }
}

@media (max-width: 768px) {
  .content-area {
    padding: 0 1rem;
  }
  
  .table-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .search-input, .filter-select {
    width: 100%;
  }
  
  .stats-summary {
    grid-template-columns: 1fr;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 640px) {
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .patient-info {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .actions-cell {
    justify-content: flex-start;
  }
}
</style>