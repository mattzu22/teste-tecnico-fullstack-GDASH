import { AuthProvider } from './hooks/auth';
import { AppRoutes } from './routes';
import { Toaster } from 'sonner';

export function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster />
    </AuthProvider>
  );
}
