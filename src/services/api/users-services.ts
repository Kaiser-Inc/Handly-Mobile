import type { SignInData } from '@screens/SignIn'
import type { SignUpData } from '@screens/SignUp'
import { api } from './api'

export async function createUser(data: SignUpData) {
  const response = await api.post('/users', data)
  return response.data
}

export async function signIn(data: SignInData) {
  const response = await api.post('/auth/login', data)
  return response.data
}
