import { storageTokenGet } from '@storage/storageToken'
import type { SignInData } from '../@types/signInSchema'
import type { SignUpData } from '../@types/singUpSchema'
import { api, apiUrl } from './api/api'

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

export async function getProfilePic() {
  const response = await api.get('/protected/profilepic')
  return response.data
}

interface imageUploadData {
  profile_pic: string
}

export async function uploadProfilePic(formData: FormData) {
  const token = await storageTokenGet()
  const response = await fetch(`${apiUrl}/protected/profilepic`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`Erro no upload: ${response.status} - ${errorData}`)
  }

  return await response.json()
}
interface updatedUsernameData {
  name: string
}

export async function updateUser(updatedUsername: updatedUsernameData) {
  const response = await api.put('/protected/profile', updatedUsername)
  return response.data
}
