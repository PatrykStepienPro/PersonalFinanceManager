export type LoginRequest = {
    email: string;
    password: string;
}

export type RegisterRequest = {
    email: string;
    password: string;
}

export type AuthResponse = {
    accessToken: string;
}

export type User = {
    id: string;
    email: string;
}