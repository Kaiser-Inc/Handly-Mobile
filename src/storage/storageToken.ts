import AsyncStorage from '@react-native-async-storage/async-storage'

import { ACCESS_TOKEN_STORAGE } from './storageConfig'

export async function storageTokenSave(token: string) {
  await AsyncStorage.setItem(ACCESS_TOKEN_STORAGE, JSON.stringify(token))
}

export async function storageTokenGet() {
  const storage = await AsyncStorage.getItem(ACCESS_TOKEN_STORAGE)

  const token: string = storage ? JSON.parse(storage) : ''

  return token
}

export async function storageTokenRemove() {
  const storage = await AsyncStorage.removeItem(ACCESS_TOKEN_STORAGE)
}
