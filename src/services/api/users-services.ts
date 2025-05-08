import { api } from './api'
import type { SignInData } from '@screens/SignUp'

export async function createUser(data: SignInData) {
  const response = await api.post('/users', data)
  return response.data
}
