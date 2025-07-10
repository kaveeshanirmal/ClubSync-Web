export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  image: string;
  role: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  image?: string;
  role?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  image?: string;
  role?: string;
}

// Auth-specific types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  image?: string;
  role?: string;
}

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  needsProfileCompletion?: boolean;
}

// Database query result types
export interface UserDbResult {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  phone: string;
  role: string;
}

// Google OAuth profile type
export interface GoogleProfile {
  given_name?: string;
  family_name?: string;
  email: string;
  picture?: string;
}
