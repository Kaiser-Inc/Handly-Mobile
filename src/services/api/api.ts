import { AppError } from '@utils/AppError'
import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://211d-45-176-66-66.ngrok-free.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '69420',
  },
})

api.interceptors.response.use(response =>  response, (error) => {
  if(error?.response?.data) {
    return Promise.reject(new AppError(error.response.data.message))
  }

  return Promise.reject(error)
})