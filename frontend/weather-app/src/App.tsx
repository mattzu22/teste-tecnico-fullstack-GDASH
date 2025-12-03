import { AuthProvider } from './hooks/auth';
import { Routes } from './routes';
import { Toaster } from 'sonner';

export function App() {
  return (
    <AuthProvider>
      <Routes />
      <Toaster />
    </AuthProvider>
  );
}
