// src/services/api.js

import axios from 'axios';

// Crée une instance Axios configurée
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000', // ✅ Utilisation d'une variable d'environnement
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ Ajoute les cookies si tu utilises l'auth via sessions ou JWT httpOnly
});

// Intercepteur pour ajouter automatiquement le token JWT s'il est stocké
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Ou selon ta méthode de stockage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
