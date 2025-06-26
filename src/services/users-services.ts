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

interface imageUploadData {
  profile_pic: string
}

export async function uploadProfilePic(profilePicture: imageUploadData) {
  const response = await api.post('/protected/profilepic', profilePicture)
  return response.data
}

interface updatedUsernameData {
  name: string
}

export async function updateUser(updatedUsername: updatedUsernameData) {
  const response = await api.put('/protected/profile', updatedUsername)
  return response.data
}
