import apiClient from './client'
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types'

export const login = (data: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/api/auth/login', data)
        .then(res => res.data)
}

export const registerApi = (data: RegisterRequest): Promise<void> => {
    return apiClient.post('/api/auth/register', data).then(() => { })
}