import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  const apiKey = import.meta.env.VITE_BACKEND_API_KEY;

  config.headers = {
    ...config.headers,
  };

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  if (apiKey) {
    config.headers['x-api-key'] = apiKey;
  }

  return config;
});

export default api;

