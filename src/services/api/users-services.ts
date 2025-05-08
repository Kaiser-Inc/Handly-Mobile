import { api } from './api'
import type { SignInData } from '@screens/SignIn'

export async function createUser(data: SignInData) {
  const response = await api.post('/users', data)
  return response.data
}
