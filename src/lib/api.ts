import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('🔑 API Request:', config.method?.toUpperCase(), config.url);
      console.log('🎫 Token being used:', token.substring(0, 15) + '...');
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('⚠️ No token found in localStorage for request to:', config.url);
    }
  }
  return config;
});

export default api;
