export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
}
