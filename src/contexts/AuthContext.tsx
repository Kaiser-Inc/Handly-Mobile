import type { UserDTO } from "@dtos/userDTO";
import { type ReactNode, createContext, useState } from "react";

export type AuthContextDataProps = {
    user: UserDTO
}

interface AuthContextPoviderProps {
    children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

export function AuthContextPovider({ children }: AuthContextPoviderProps) {
    const [user, setUser] = useState<UserDTO>({
            cpf_cnpj: '0413021101',
            email: 'email@email.com',
            name: 'kaiser',
            role: 'provider' as const,
            profile_pic: 'kaiser.png'
    })

    return(
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    )
}