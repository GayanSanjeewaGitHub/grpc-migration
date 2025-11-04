import { User } from '../models/user';

// Mock user data
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    age: 30,
    department: 'Engineering',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    age: 28,
    department: 'Marketing',
    isActive: true,
    createdAt: '2024-02-20T14:30:00Z'
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@company.com',
    age: 35,
    department: 'Sales',
    isActive: false,
    createdAt: '2024-01-10T09:15:00Z'
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice.brown@company.com',
    age: 32,
    department: 'Engineering',
    isActive: true,
    createdAt: '2024-03-05T11:45:00Z'
  },
  {
    id: '5',
    name: 'Charlie Wilson',
    email: 'charlie.wilson@company.com',
    age: 29,
    department: 'HR',
    isActive: true,
    createdAt: '2024-02-28T16:20:00Z'
  }
];

// In-memory database simulation
let users: User[] = [...mockUsers];