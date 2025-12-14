import axios from 'axios';

const api = axios.create({
  // PENTING: Ganti port 5000 sesuai port Backend .NET kamu
  baseURL: 'https://localhost:7137/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;