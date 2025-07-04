import { signIn } from '@services/users-services'
import {
  type ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react'
import type { SignInData } from '../@types/signInSchema'

import { api } from '@services/api/api'
import {
  storageTokenGet,
  storageTokenRemove,
  storageTokenSave,
} from '@storage/storageToken'

export type AuthContextDataProps = {
  token: string
  authenticate: (signInData: SignInData) => Promise<void>
  isLoadingUserStorageData: boolean
  signOut: () => Promise<void>
}

interface AuthContextPoviderProps {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
)

export function AuthContextPovider({ children }: AuthContextPoviderProps) {
  const [token, setToken] = useState<string>('')
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)

  async function authenticate(signInData: SignInData) {
    const user = await signIn(signInData)
    if (user.access_token) {
      await storageTokenSave(user.access_token)
      setToken(user.access_token)
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true)
      setToken('')
      await storageTokenRemove()
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  const loadUserData = useCallback(async () => {
    try {
      const userLogged = await storageTokenGet()

      if (userLogged) {
        setToken(userLogged)
      }
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }, [])

  useEffect(() => {
    loadUserData()
  }, [loadUserData])

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`
    } else {
      api.defaults.headers.common.Authorization = undefined
    }
  }, [token])

  return (
    <AuthContext.Provider
      value={{
        token,
        authenticate,
        isLoadingUserStorageData,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
