import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
    children: ReactNode;
    role?: UserRole | UserRole[];
    redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    role,
    redirectTo = '/login'
}) => {
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
        return <Navigate to={redirectTo} replace />;
    }

    // Check if specific role is required
    if (role) {
        const allowedRoles = Array.isArray(role) ? role : [role];
        const hasRequiredRole = allowedRoles.includes(user.role as UserRole);

        if (!hasRequiredRole) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
