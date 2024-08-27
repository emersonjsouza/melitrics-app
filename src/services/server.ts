import axios from 'axios';
import Settings from '../settings'

const DEBUG = false;

const server = axios.create({
  baseURL: Settings.API
});

export const serverForm = axios.create({
  baseURL: Settings.API,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});


server.interceptors.request.use((config) => {
  /** In dev, intercepts request and logs it into console for dev */
  if (DEBUG) { console.info("✉️ ", config); }
  return config;
}, (error) => {
  if (DEBUG) { console.error("✉️ ", error); }
  return Promise.reject(error);
});


export default server;