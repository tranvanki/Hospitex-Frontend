import { createRouter, createWebHistory } from "vue-router";
import Home from './views/dashboard/Home.vue';
import Login from './views/auth/Login.vue';
import Signup from './views/auth/Signup.vue';
import StaffList from './views/StaffList.vue';
import AdminDashboard from './views/dashboard/admin-dashboard.vue';
import DoctorDashboard from './views/dashboard/doctor-dashboard.vue';
import AddRecord from './views/medicalRecord/AddRecord.vue';
import RecordList from './views/medicalRecord/RecordList.vue';
import CreatePatient from "./views/patient/CreatePatient.vue";
import EditPatient from "./views/patient/EditPatient.vue";
import patient_list from "./views/patient/patient_list.vue";
import PatientDetails from "./views/patient/PatientDetails.vue";
import AddVitals from "./views/vitals/AddVitals.vue";
import VitalsList from "./views/vitals/VitalsList.vue";
import PatientVitals from "./views/vitals/PatientVitals.vue";
import AddStaff from "./view/Addstaff.vue";

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/signup', name: 'Signup', component: Signup },
  { path: '/staff-list', name: 'StaffList', component: StaffList },
  { path: '/admin-dashboard', name: 'AdminDashboard', component: AdminDashboard },
  { path: '/doctor-dashboard', name: 'DoctorDashboard', component: DoctorDashboard },
  { path: '/add-record', name: 'AddRecord', component: AddRecord },
  { path: '/record-list', name: 'RecordList', component: RecordList },
  { path: '/create-patient', name: 'CreatePatient', component: CreatePatient },
  { path: '/edit-patient/:id', name: 'EditPatient', component: EditPatient, props: true },
  { path: '/patient-list', name: 'PatientList', component: patient_list },
  { path: '/patient-details/:id', name: 'PatientDetails', component: PatientDetails, props: true },
  
  { path: '/patient/:id/add-vitals', name: 'AddVitals', component: AddVitals, props: true },
  
  { path: '/vitals-list', name: 'VitalsList', component: VitalsList },
  { path: '/patient/:patientId/vitals', name: 'PatientVitals', component: PatientVitals, props: true },
  { 
    path: '/patient/:patientId/add-record', 
    name: 'AddPatientRecord', 
    component: AddRecord, 
    props: true 
  },
  {path: '/add-staff',
    name: 'AddStaff',
    component: AddStaff}
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
