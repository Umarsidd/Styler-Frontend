/**
 * Form validation helpers using Zod-like validation
 */

export interface ValidationResult {
    valid: boolean;
    errors: Record<string, string>;
}

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number (Indian format)
 */
export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
    if (password.length < 6) {
        return { valid: false, message: 'Password must be at least 6 characters' };
    }
    return { valid: true };
};

/**
 * Validate required field
 */
export const isRequired = (value: any): boolean => {
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== undefined;
};

/**
 * Validate pincode (Indian)
 */
export const isValidPincode = (pincode: string): boolean => {
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(pincode);
};

/**
 * Validate form data
 */
export const validateForm = <T extends Record<string, any>>(
    data: T,
    rules: Record<keyof T, (value: any) => string | null>
): ValidationResult => {
    const errors: Record<string, string> = {};

    Object.keys(rules).forEach((field) => {
        const error = rules[field](data[field]);
        if (error) {
            errors[field] = error;
        }
    });

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};

/**
 * Common validation rules
 */
export const rules = {
    required: (message = 'This field is required') => (value: any) => {
        return isRequired(value) ? null : message;
    },

    email: (message = 'Please enter a valid email') => (value: string) => {
        return isValidEmail(value) ? null : message;
    },

    phone: (message = 'Please enter a valid 10-digit phone number') => (value: string) => {
        return isValidPhone(value) ? null : message;
    },

    minLength: (length: number, message?: string) => (value: string) => {
        return value.length >= length ? null : message || `Must be at least ${length} characters`;
    },

    maxLength: (length: number, message?: string) => (value: string) => {
        return value.length <= length ? null : message || `Must be at most ${length} characters`;
    },

    min: (min: number, message?: string) => (value: number) => {
        return value >= min ? null : message || `Must be at least ${min}`;
    },

    max: (max: number, message?: string) => (value: number) => {
        return value <= max ? null : message || `Must be at most ${max}`;
    },

    matches: (pattern: RegExp, message = 'Invalid format') => (value: string) => {
        return pattern.test(value) ? null : message;
    },
};
