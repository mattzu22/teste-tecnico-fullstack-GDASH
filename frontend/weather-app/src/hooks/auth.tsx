/* eslint-disable react-hooks/immutability */
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

export const AuthContext = createContext({});

interface loginProps {
  email: string;
  password: string;
}

interface DataProps {
  token?: string;
}
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // const token = localStorage.getItem('token');
  const [data, setData] = useState<DataProps>({});
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(0);

  async function login({ email, password }: loginProps) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { token } = response.data;

      localStorage.setItem('token', token);

      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      setMessage('Login realizado com sucesso!');
      setStatus(response.status);
      setTimeoutMessage();

      setData({ token });
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

    setData({});
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
      setData({ token });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, data, message, status }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
