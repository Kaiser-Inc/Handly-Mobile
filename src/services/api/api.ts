import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://6120-191-247-19-198.ngrok-free.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '69420',
  },
})
