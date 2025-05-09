import axios from 'axios'

export const api = axios.create({
  // baseURL: 'http://localhost:8080',
  baseURL: 'https://a1f1-191-247-9-11.ngrok-free.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '69420',
  },
})
