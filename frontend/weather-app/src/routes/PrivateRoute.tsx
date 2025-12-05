import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';

interface AuthContextData {
  token: string | null;
  loading: boolean;
}

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, loading } = useAuth() as AuthContextData;

  if (loading) {
    return null;
  }

  return token ? <>{children}</> : <Navigate to="/" />;
};
