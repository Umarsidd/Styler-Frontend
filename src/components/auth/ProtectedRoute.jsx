import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

const ProtectedRoute = ({ children, role, redirectTo = '/login' }) => {
    const { user, loading, hasRole } = useAuth();

    if (loading) {
        return <Loader />;
    }

    if (!user) {
        return <Navigate to={redirectTo} replace />;
    }

    // If role is specified, check if user has required role
    if (role) {
        if (!hasRole(role)) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
