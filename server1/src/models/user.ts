export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  department: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  age: number;
  department: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  age?: number;
  department?: string;
  isActive?: boolean;
}