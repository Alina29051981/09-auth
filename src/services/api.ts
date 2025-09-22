import axios from 'axios';

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

export const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
  
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
});

api.interceptors.request.use((config) => {
  const t = import.meta.env.VITE_NOTEHUB_TOKEN;
  if (t && config.headers) {
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});
