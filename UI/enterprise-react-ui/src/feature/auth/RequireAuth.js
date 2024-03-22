// requireAuth.js
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RequireAuth = (component) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    return isAuthenticated ? component : <Navigate to="/login" replace />;
};

export default RequireAuth;
