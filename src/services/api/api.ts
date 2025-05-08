import axios from 'axios'

export const api = axios.create({
  // baseURL: 'http://localhost:8080',
  baseURL: 'https://6951-45-176-66-66.ngrok-free.app/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})
