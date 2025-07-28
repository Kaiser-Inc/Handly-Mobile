import { AppError } from '@utils/AppError'
import axios from 'axios'

export const apiUrl = 'https://fb86d521d9da.ngrok-free.app'

export const api = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '69420',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'Algo deu errado, por favor tente novamente.'

    if (
      error.response?.data &&
      Array.isArray(error.response.data) &&
      error.response.data.length > 0
    ) {
      const firstError = error.response.data[0]
      if (firstError.message) {
        errorMessage = firstError.message
      }
    }

    return Promise.reject(new AppError(errorMessage))
  },
)
