import type { UserDTO } from "@dtos/userDTO";
import { signIn } from "@services/users-services";
import { type ReactNode, createContext, useState } from "react";
import type { SignInData } from "../@types/signInSchema";

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
        try {
            const user = await signIn(signInData)
            if(user.access_token) {
                setToken(user.access_token)
            }
        } catch (error) {
            throw new Error(`Erro: ${error}`);
        }
    }

    return(
        <AuthContext.Provider value={{ token , authenticate }}>
            {children}
        </AuthContext.Provider>
    )
}