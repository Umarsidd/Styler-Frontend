import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { UserRole } from '../types';

interface RBACContextType {
    userRole: UserRole | null;
    userPermissions: string[];
    loading: boolean;
    hasPermission: (permission: string) => boolean;
    hasAnyPermission: (permissions: string[]) => boolean;
    hasAllPermissions: (permissions: string[]) => boolean;
    hasRole: (roles: UserRole | UserRole[]) => boolean;
    isSuperAdmin: () => boolean;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export const useRBAC = (): RBACContextType => {
    const context = useContext(RBACContext);
    if (!context) {
        throw new Error('useRBAC must be used within RBACProvider');
    }
    return context;
};

interface RBACProviderProps {
    children: ReactNode;
}

export const RBACProvider: React.FC<RBACProviderProps> = ({ children }) => {
    const { user } = useAuth();
    const [userPermissions, setUserPermissions] = useState<string[]>([]);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            // Set role from user object
            setUserRole((user.role as UserRole) || UserRole.CUSTOMER);

            // Get permissions from user object (if provided by backend)
            if (user.permissions) {
                setUserPermissions(user.permissions);
            } else {
                setUserPermissions([]);
            }
        } else {
            setUserRole(null);
            setUserPermissions([]);
        }
        setLoading(false);
    }, [user]);

    /**
     * Check if user has a specific permission
     */
    const hasPermission = (permission: string): boolean => {
        if (!user) return false;

        // Super admin has all permissions
        if (userRole === UserRole.SUPER_ADMIN) return true;

        // Check if permission exists in user's permissions
        return userPermissions.includes(permission);
    };

    /**
     * Check if user has ANY of the specified permissions
     */
    const hasAnyPermission = (permissions: string[]): boolean => {
        if (!user) return false;
        if (userRole === UserRole.SUPER_ADMIN) return true;

        return permissions.some((perm) => userPermissions.includes(perm));
    };

    /**
     * Check if user has ALL of the specified permissions
     */
    const hasAllPermissions = (permissions: string[]): boolean => {
        if (!user) return false;
        if (userRole === UserRole.SUPER_ADMIN) return true;

        return permissions.every((perm) => userPermissions.includes(perm));
    };

    /**
     * Check if user has a specific role
     */
    const hasRole = (roles: UserRole | UserRole[]): boolean => {
        if (!user) return false;

        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        return userRole !== null && allowedRoles.includes(userRole);
    };

    /**
     * Check if user is a super admin
     */
    const isSuperAdmin = (): boolean => {
        return userRole === UserRole.SUPER_ADMIN;
    };

    const value: RBACContextType = {
        userRole,
        userPermissions,
        loading,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        isSuperAdmin,
    };

    return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
};
