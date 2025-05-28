import type { SignInData } from '../@types/signInSchema'
import type { SignUpData } from '../@types/singUpSchema'
import { api } from './api/api'

export async function createUser(data: SignUpData) {
  const response = await api.post('/users', data)
  return response.data
}

export async function signIn(data: SignInData) {
  const response = await api.post('/auth/login', data)
  return response.data
}
