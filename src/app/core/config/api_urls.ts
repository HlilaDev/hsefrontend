export const BASE_URL = "http://localhost:5000/" ;
export const URL_UPLOAD = "http://localhost:5000/uploads/"
export const BASE_API_URL = "http://localhost:5000/api"

export const API_URLS ={
    auth:{
    //Auth API
    register:`${BASE_API_URL}/auth/register`,
    login:`${BASE_API_URL}/auth/login`,
    logout:`${BASE_API_URL}/auth/logout`,
    me:`${BASE_API_URL}/auth/me`
    // verifyEmail:`${BASE_API_URL}/auth/verify-email`,
    },


    //Users API
    users:{
    allusers:`${BASE_API_URL}/users/`,
    getUserById:`${BASE_API_URL}/users/`,
    editUser:`${BASE_API_URL}/users/`,
    deleteUser:`${BASE_API_URL}/users/`,
     },

         //Zones API
    zones:{
    allZones:`${BASE_API_URL}/zones/`,
    getZoneById:`${BASE_API_URL}/zones/`,
    editZone:`${BASE_API_URL}/zones/`,
    deleteZone:`${BASE_API_URL}/zones/`,
     },

    //Devices API
   devices: {
  allDevices: `${BASE_API_URL}/devices/`,
  getDeviceById: `${BASE_API_URL}/devices/`,
  addDevice: `${BASE_API_URL}/devices/`,
  editDevice: `${BASE_API_URL}/devices/`,
  deleteDevice: `${BASE_API_URL}/devices/`,
  deviceSensors: `${BASE_API_URL}/devices/`,
 restartDevice: `${BASE_API_URL}/devices/`,
  // optionnel: toggle status, etc...
},

   employees: {
  allEmployee: `${BASE_API_URL}/employees/`,
  getEmployeeById: `${BASE_API_URL}/employees/`,
  addEmployee: `${BASE_API_URL}/employees/`,
  editEmployee: `${BASE_API_URL}/employees/`,
  deleteEmployee: `${BASE_API_URL}/employees/`,
  // optionnel: toggle status, etc...
},

       //observation
observations: {
    create: `${BASE_API_URL}/observations`,
    list: `${BASE_API_URL}/observations`,
    byId: (id: string) => `${BASE_API_URL}/observations/${id}`,
    addImage: (id: string) => `${BASE_API_URL}/observations/${id}/images`,
    totalCountByAgent: (agentId: string) => `${BASE_API_URL}/observations/agent/${agentId}/count`, // Nouvelle route pour obtenir le nombre total d'observations pour un agent

  },

  upload: {
  images: `${BASE_API_URL}/upload`,
},
// Sensors API
sensors: {
  allSensors: `${BASE_API_URL}/sensors/`,
  getSensorById: `${BASE_API_URL}/sensors/`,      // + id
  addSensor: `${BASE_API_URL}/sensors/`,
  editSensor: `${BASE_API_URL}/sensors/`,         // + id
  deleteSensor: `${BASE_API_URL}/sensors/`,       // + id
  updateStatus: (id: string) => `${BASE_API_URL}/sensors/${id}/status`,
},

//trainings
 trainings: {
    allTrainings: `${BASE_API_URL}/trainings/`,
    getTrainingById: (id: string) => `${BASE_API_URL}/trainings/${id}`,
    createTraining: `${BASE_API_URL}/trainings/`,
    editTraining: (id: string) => `${BASE_API_URL}/trainings/${id}`,
    deleteTraining: (id: string) => `${BASE_API_URL}/trainings/${id}`,
    addParticipant: (id: string) => `${BASE_API_URL}/trainings/${id}/participants`,
    updateParticipant: (id: string, participantId: string) => `${BASE_API_URL}/trainings/${id}/participants/${participantId}`,
    removeParticipant: (id: string, participantId: string) => `${BASE_API_URL}/trainings/${id}/participants/${participantId}`,
  },

  // Reports API
  reports: {
    create: `${BASE_API_URL}/reports`,
    list: `${BASE_API_URL}/reports`,
    byId: (id: string) => `${BASE_API_URL}/reports/${id}`,
    update: (id: string) => `${BASE_API_URL}/reports/${id}`,
    updateMetrics: (id: string) => `${BASE_API_URL}/reports/${id}/metrics`,
    delete: (id: string) => `${BASE_API_URL}/reports/${id}`,
  },

  // readings
readings: {
  list: `${BASE_API_URL}/readings`, // liste paginée + filtres

  byId: (id: string) => `${BASE_API_URL}/readings/${id}`,

  latestByDevice: (deviceId: string) =>
    `${BASE_API_URL}/readings/latest/device/${deviceId}`,

  historyByDevice: (deviceId: string) =>
    `${BASE_API_URL}/readings/history/device/${deviceId}`,

  latestByZone: (zoneId: string) =>
    `${BASE_API_URL}/readings/latest/zone/${zoneId}`,
}

}
