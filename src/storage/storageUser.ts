import AsyncStorage from '@react-native-async-storage/async-storage'

import { USER_STORAGE } from './storageConfig'

export async function storageUserSave(token: string) {
  await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(token))
}

export async function storageUserGet() {
  const storage = await AsyncStorage.getItem(USER_STORAGE)

  const token: string = storage ? JSON.parse(storage) : ''

  return token
}

export async function storageUserRemove() {
  const storage = await AsyncStorage.removeItem(USER_STORAGE)
}
