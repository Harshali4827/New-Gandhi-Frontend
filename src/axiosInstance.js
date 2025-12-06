// import axios from 'axios';
// import config from './config';

// const axiosInstance = axios.create({
//   baseURL: config.baseURL,
//   withCredentials: true,
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     console.log('Token from localStorage:', token);
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// export default axiosInstance;




import axios from 'axios';
import config from './config';

const axiosInstance = axios.create({
  baseURL: config.baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear all authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userPermissions');
      
      // Check if we're already on login page to avoid infinite redirects
      const isLoginPage = window.location.hash === '#/login' || 
                          window.location.hash === '#/verify-otp';
      
      if (!isLoginPage) {
        // Show a quick notification before redirecting
        if (window.showToast) {
          window.showToast('Session expired. Please login again.', 'warning');
        }
        
        // Redirect to login page
        setTimeout(() => {
          window.location.hash = '#/login';
        }, 100);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
