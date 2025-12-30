import { AxiosError } from 'axios';

export interface ApiErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        statusCode: number;
        details?: any;
    };
}

export interface ErrorResult {
    code: string;
    message: string;
    statusCode: number;
}

// Map backend error codes to user-friendly messages
const ERROR_MESSAGES: Record<string, string> = {
    INVALID_CREDENTIALS: 'Invalid email/phone or password',
    TOKEN_EXPIRED: 'Session expired. Please login again',
    TOKEN_INVALID: 'Invalid authentication token',
    UNAUTHORIZED: 'You need to be logged in to access this',
    FORBIDDEN: 'You don\'t have permission to perform this action',
    INVALID_INPUT: 'Please check your input and try again',
    NOT_FOUND: 'The requested resource was not found',
    ALREADY_EXISTS: 'This resource already exists',
    APPOINTMENT_UNAVAILABLE: 'This time slot is no longer available',
    PAYMENT_FAILED: 'Payment processing failed. Please try again',
    TOO_MANY_REQUESTS: 'Too many requests. Please try again later',
    INTERNAL_ERROR: 'Something went wrong on our end. Please try again',
};

/**
 * Handle API errors and return standardized error object
 */
export const handleApiError = (error: unknown): ErrorResult => {
    // Check if it's an Axios error with response
    if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as AxiosError<ApiErrorResponse>;

        if (axiosError.response?.data?.error) {
            const { code, message, statusCode } = axiosError.response.data.error;

            return {
                code,
                message: ERROR_MESSAGES[code] || message,
                statusCode,
            };
        }

        // Handle network errors
        if (axiosError.message === 'Network Error') {
            return {
                code: 'NETWORK_ERROR',
                message: 'Unable to connect to server. Please check your internet connection.',
                statusCode: 0,
            };
        }

        // Handle timeout errors
        if (axiosError.code === 'ECONNABORTED') {
            return {
                code: 'TIMEOUT',
                message: 'Request timed out. Please try again.',
                statusCode: 0,
            };
        }
    }

    // Default error
    return {
        code: 'UNKNOWN_ERROR',
        message: 'Something went wrong. Please try again.',
        statusCode: 500,
    };
};

/**
 * Get user-friendly error message for a given error code
 */
export const getErrorMessage = (code: string): string => {
    return ERROR_MESSAGES[code] || 'An unexpected error occurred';
};

/**
 * Check if error is authentication related
 */
export const isAuthError = (error: ErrorResult): boolean => {
    return ['TOKEN_EXPIRED', 'TOKEN_INVALID', 'UNAUTHORIZED'].includes(error.code);
};

/**
 * Check if error is a validation error
 */
export const isValidationError = (error: ErrorResult): boolean => {
    return error.code === 'INVALID_INPUT';
};

/**
 * Check if error is a permission error
 */
export const isPermissionError = (error: ErrorResult): boolean => {
    return error.code === 'FORBIDDEN';
};
