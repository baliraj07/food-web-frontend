import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const RequireAdmin = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/" />;
  
  return children;
};

export default RequireAdmin;
