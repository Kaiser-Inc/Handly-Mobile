import { signIn } from "@services/users-services";
import { type ReactNode, createContext, useCallback, useEffect, useState } from "react";
import type { SignInData } from "../@types/signInSchema";

import { storageUserGet, storageUserRemove, storageUserSave } from '@storage/storageUser'

export type AuthContextDataProps = {
    token: string
    authenticate: (signInData: SignInData) => Promise<void>
    isLoadingUserStorageData: boolean
    signOut: () => Promise<void>
}

interface AuthContextPoviderProps {
    children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

export function AuthContextPovider({ children }: AuthContextPoviderProps) {
    const [token, setToken] = useState<string>('')
    const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)

    async function authenticate(signInData: SignInData) {
        const user = await signIn(signInData)
        if(user.access_token) {
            setToken(user.access_token)
            storageUserSave(user.access_token)
        }
    }

    async function signOut() {
        try {
            setIsLoadingUserStorageData(true)
            setToken('')
            await storageUserRemove()
        } finally {
            setIsLoadingUserStorageData(false)
        }
    }
    
    const loadUserData = useCallback(async () => {
        try {
            const userLogged = await storageUserGet()
            
            if(userLogged) {
                setToken(userLogged)
            }
        } finally {
            setIsLoadingUserStorageData(false)
        }
    }, [])


    useEffect(() => {
        loadUserData()
    }, [loadUserData])

    return(
        <AuthContext.Provider value={{ 
            token,
            authenticate,
            isLoadingUserStorageData,
            signOut
            }}>
            {children}
        </AuthContext.Provider>
    )
}