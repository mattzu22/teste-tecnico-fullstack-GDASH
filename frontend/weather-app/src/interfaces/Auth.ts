export interface UseAuthProps {
  login: (data: loginProps) => Promise<void>;
  message: string;
  status: number;
}

export interface loginProps {
  email: string;
  password: string;
}
