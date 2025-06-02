import { AppError } from '@utils/AppError'
import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://a0b0-200-129-62-72.ngrok-free.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '69420',
  },
})

api.interceptors.response.use(response =>  response, (error) => {
  let errorMessage = "Algo deu errado, por favor tente novamente."

  if (error.response?.data && Array.isArray(error.response.data) && error.response.data.length > 0) {
    const firstError = error.response.data[0];
    if (firstError.message) {
      errorMessage = firstError.message;
    }
  }

  return Promise.reject(new AppError(errorMessage))
})