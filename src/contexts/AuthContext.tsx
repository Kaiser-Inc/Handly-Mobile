import { signIn } from "@services/users-services";
import { type ReactNode, createContext, useCallback, useEffect, useState } from "react";
import type { SignInData } from "../@types/signInSchema";

import { storageUserGet, storageUserSave } from '@storage/storageUser'

export type AuthContextDataProps = {
    token: string
    authenticate: (signInData: SignInData) => Promise<void>
}

interface AuthContextPoviderProps {
    children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

export function AuthContextPovider({ children }: AuthContextPoviderProps) {
    const [token, setToken] = useState<string>('')

    async function authenticate(signInData: SignInData) {
        const user = await signIn(signInData)
        if(user.access_token) {
            setToken(user.access_token)
            storageUserSave(user.access_token)
        }
    }

    const loadUserData = useCallback(async () => {
        const userLogged = await storageUserGet()
        
        if(userLogged) {
            setToken(userLogged)
        }
    }, [])

    useEffect(() => {
        loadUserData()
    }, [loadUserData])

    return(
        <AuthContext.Provider value={{ token, authenticate }}>
            {children}
        </AuthContext.Provider>
    )
}