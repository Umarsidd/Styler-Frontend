import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthStore } from '../stores/authStore';
import { User, AuthResponse } from '../types';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (authData: AuthResponse) => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const setAuth = useAuthStore((state) => state.setAuth);
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const updateUserStore = useAuthStore((state) => state.updateUser);

    const login = (authData: AuthResponse) => {
        const { user, tokens } = authData;
        setAuth(user, tokens.accessToken, tokens.refreshToken);
    };

    const logout = () => {
        clearAuth();
    };

    const updateUser = (updates: Partial<User>) => {
        updateUserStore(updates);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated,
        login,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
