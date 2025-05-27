import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://b09f-200-129-62-72.ngrok-free.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '69420',
  },
})
