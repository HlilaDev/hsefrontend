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

       
}
