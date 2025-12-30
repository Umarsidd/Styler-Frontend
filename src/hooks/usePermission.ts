/**
 * Permission hooks for role-based access control
 */

export interface RBACContextType {
    hasPermission: (permission: string) => boolean;
    hasAnyPermission: (permissions: string[]) => boolean;
    hasAllPermissions: (permissions: string[]) => boolean;
    hasRole: (roles: string | string[]) => boolean;
    userRole?: string;
    userPermissions: string[];
    isSuperAdmin: () => boolean;
}

// Placeholder hook - will be properly implemented with RBACContext
const useRBAC = (): RBACContextType => {
    return {
        hasPermission: () => true,
        hasAnyPermission: () => true,
        hasAllPermissions: () => true,
        hasRole: () => true,
        userRole: undefined,
        userPermissions: [],
        isSuperAdmin: () => false,
    };
};

/**
 * Hook to check if user has a specific permission
 */
export const usePermission = (permission: string): boolean => {
    const { hasPermission } = useRBAC();
    return hasPermission(permission);
};

/**
 * Hook to check if user has any of the specified permissions
 */
export const useAnyPermission = (permissions: string[]): boolean => {
    const { hasAnyPermission } = useRBAC();
    return hasAnyPermission(permissions);
};

/**
 * Hook to check if user has all of the specified permissions
 */
export const useAllPermissions = (permissions: string[]): boolean => {
    const { hasAllPermissions } = useRBAC();
    return hasAllPermissions(permissions);
};

/**
 * Hook to check if user has a specific role
 */
export const useRole = (roles: string | string[]): boolean => {
    const { hasRole } = useRBAC();
    return hasRole(roles);
};

/**
 * Hook to get current user's role and permissions
 */
export const useUserRole = (): {
    role?: string;
    permissions: string[];
    isSuperAdmin: boolean;
} => {
    const { userRole, userPermissions, isSuperAdmin } = useRBAC();
    return {
        role: userRole,
        permissions: userPermissions,
        isSuperAdmin: isSuperAdmin(),
    };
};
