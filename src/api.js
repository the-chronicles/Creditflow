
// // src/api.js
// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'https://cash-flow-be.onrender.com/api', // Adjust path if needed
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });



// // Automatically attach token for authenticated routes
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('userToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;




// src/api.js
import axios from 'axios';

// Create the default axios instance
const api = axios.create({
  baseURL: 'https://cash-flow-be.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a separate instance for file uploads
const apiFormData = axios.create({
  baseURL: 'https://cash-flow-be.onrender.com/api',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Request interceptor for both instances
// Request interceptor for both instances
const attachToken = (config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn('No token found in localStorage');
  }
  return config;
};

api.interceptors.request.use(attachToken);
apiFormData.interceptors.request.use(attachToken);

// Named exports
export { api, apiFormData };

// Default export (api as default)
export default api;