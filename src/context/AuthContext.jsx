import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';
import { UserRole } from '../types';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const authStore = useAuthStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already authenticated on mount
        const initAuth = async () => {
            if (authStore.isAuthenticated()) {
                try {
                    // Verify token is still valid by fetching user profile
                    const response = await authService.getMe();
                    if (response.success && response.data) {
                        authStore.updateUser(response.data);
                    }
                } catch (error) {
                    // Token invalid, clear auth
                    authStore.clearAuth();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (userData) => {
        const { user, tokens } = userData.data || userData;

        authStore.setAuth(
            user,
            tokens.accessToken,
            tokens.refreshToken
        );
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            authStore.clearAuth();
        }
    };

    const updateProfile = (updates) => {
        authStore.updateUser(updates);
    };

    const isAuthenticated = () => {
        return authStore.isAuthenticated();
    };

    const hasRole = (roles) => {
        if (!authStore.user) return false;

        if (Array.isArray(roles)) {
            return roles.includes(authStore.user.role);
        }
        return authStore.user.role === roles;
    };

    const isAdmin = () => {
        return hasRole([UserRole.SUPER_ADMIN]);
    };

    const isSalonOwner = () => {
        return hasRole([UserRole.SALON_OWNER, UserRole.SUPER_ADMIN]);
    };

    const isBarber = () => {
        return hasRole([UserRole.BARBER]);
    };

    const isCustomer = () => {
        return hasRole([UserRole.CUSTOMER]);
    };

    return (
        <AuthContext.Provider
            value={{
                user: authStore.user,
                loading,
                login,
                logout,
                isAdmin,
                isSalonOwner,
                isBarber,
                isCustomer,
                isAuthenticated,
                hasRole,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
