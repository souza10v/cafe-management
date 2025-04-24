export namespace UserModels {
    export interface LoginRequest {
        email: string;
        password: string;
    }
    export interface LoginResponse {
        token: string;
        message: string;
    }
    export interface ErrorResponse {
        error: string;
    }

    export interface ResetPasswordRequest {
        email: string;
    }

    export interface ForgotPasswordRequest {
        email: string;
    }
    export interface ForgotPasswordResponse {
        message: string;
    }

    export interface ChangePasswordResponse {
        message: string;
    }

    export interface ChangePasswordRequest {
        oldPassword: string;
        newPassword: string;
        confirmPassword: string;
    }
    export interface SignupRequest {
        name: string;
        email: string;
        phone: string;
        password: string;
        status: boolean;
        role: string;
    }

    export interface SignupResponse {
        message: string;
    }
}