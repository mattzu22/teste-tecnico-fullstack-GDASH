export interface UseAuthProps {
  login: (data: loginProps) => Promise<void>;
  message: string;
  status: number;
  token: string | null;
  user: DecodedUser | null;
  logout: () => void;
  loading: boolean;
}

export interface DecodedUser {
  sub: string;
  name: string;
  email: string;
  roles: string[];
}

export interface loginProps {
  email: string;
  password: string;
}
