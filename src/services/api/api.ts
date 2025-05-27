import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://f799-45-176-66-66.ngrok-free.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '69420',
  },
})
