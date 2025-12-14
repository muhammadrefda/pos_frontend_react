import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7137/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor (untuk token otomatis), semacam middleware di .net
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    // Jika token ada, sisipkan di header sebagai Bearer Token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default api;