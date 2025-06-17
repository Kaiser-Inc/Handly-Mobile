import type { SignInData } from '../@types/signInSchema'
import type { SignUpData } from '../@types/singUpSchema'
import { api } from './api/api'

export async function createUser(signUpData: SignUpData) {
  const response = await api.post('/users', signUpData)
  return response.data
}

export async function signIn(signInData: SignInData) {
  const response = await api.post('/auth/login', signInData)
  return response.data
}

export async function getProfile() {
  const response = await api.get('/protected/profile')
  return response.data
}
