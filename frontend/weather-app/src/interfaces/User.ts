export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserProps {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreateUserResponse {
  status: number;
  message: string;
}

export interface UpdateUserProps {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  newPassword?: string;
}

export interface UpdateUserResponse {
  status: number;
  message: string;
}

export interface DeleteUserResponse {
  status: number;
  message: string;
}

export interface ListUsersResponse {
  status: number;
  message: string;
  users: User[];
}
