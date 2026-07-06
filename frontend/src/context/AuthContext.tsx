import { createContext, useContext, useState } from "react"
import type { User } from "../types/auth.types"

interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const decodeToken = (token: string): User => {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return { id: payload.sub, email: payload.email }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(
        localStorage.getItem('token') ? decodeToken(localStorage.getItem('token')!) : null
    )

    const login = (newToken: string) => {
        localStorage.setItem('token', newToken)
        setUser(decodeToken(newToken))
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }


    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) throw new Error("use Auth musi byc użytyt wewnątrz AuthProvider");
    return context;
}