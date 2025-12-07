/* eslint-disable react-hooks/immutability */
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';
import { type loginProps } from '@/interfaces/Auth';
import { jwtDecode } from 'jwt-decode';
import type { DecodedUser } from '@/interfaces/Auth';

interface AuthContextData {
  login: (credentials: loginProps) => Promise<void>;
  logout: () => void;
  user: DecodedUser | null;
  token: string | null;
  loading: boolean;
  message: string;
  status: number;
}

// Interface for the internal state
interface AuthState {
  token: string | null;
  user: DecodedUser | null;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AuthState>({ token: null, user: null });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(0);

  async function login({ email, password }: loginProps) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { token } = response.data;
      const user: DecodedUser = jwtDecode(token);

      localStorage.setItem('token', token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      setData({ token, user });

      setMessage('Login realizado com sucesso!');
      setStatus(response.status);
      setTimeoutMessage();
    } catch (error: Error | any) {
      if (error.response) {
        setMessage(error.response.data.message);
        setStatus(error.response.status);
      } else {
        setMessage('Não foi possivel fazer login');
        setStatus(500);
      }

      setTimeoutMessage();
    }
  }

  function logout() {
    localStorage.removeItem('token');

    setData({ token: null, user: null });
  }

  function setTimeoutMessage() {
    setTimeout(() => {
      setMessage('');
      setStatus(0);
    }, 50);
  }

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      const user: DecodedUser = jwtDecode(token);
      setData({ token, user });
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        user: data.user,
        token: data.token,
        loading,
        message,
        status,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
