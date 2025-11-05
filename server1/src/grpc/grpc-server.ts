import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { mockUsers } from '../data/mock-users';
import { User } from '../models/user';

// Load proto file
const PROTO_PATH = path.join(__dirname, '../../../proto/user.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const userProto: any = grpc.loadPackageDefinition(packageDefinition).user;

// In-memory database
let users: User[] = [...mockUsers];

// gRPC Service Implementation
const userService = {
  GetUsers: (call: any, callback: any) => {
    try {
      const { department, is_active } = call.request;
      
      let filteredUsers = users;
      
      // Apply filters if provided
      if (department) {
        filteredUsers = filteredUsers.filter(user => 
          user.department.toLowerCase() === department.toLowerCase()
        );
      }
      
      if (is_active !== undefined && is_active !== null) {
        filteredUsers = filteredUsers.filter(user => user.isActive === is_active);
      }
      
      // Convert User objects to proto format
      const protoUsers = filteredUsers.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age,
        department: user.department,
        is_active: user.isActive,
        created_at: user.createdAt
      }));
      
      callback(null, {
        success: true,
        count: protoUsers.length,
        users: protoUsers,
        error: ''
      });
    } catch (error: any) {
      callback(null, {
        success: false,
        count: 0,
        users: [],
        error: error.message || 'Failed to fetch users'
      });
    }
  },

  GetUserById: (call: any, callback: any) => {
    try {
      const { id } = call.request;
      
      const user = users.find(u => u.id === id);
      
      if (!user) {
        return callback(null, {
          success: false,
          user: null,
          error: `User with id ${id} not found`
        });
      }
      
      const protoUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age,
        department: user.department,
        is_active: user.isActive,
        created_at: user.createdAt
      };
      
      callback(null, {
        success: true,
        user: protoUser,
        error: ''
      });
    } catch (error: any) {
      callback(null, {
        success: false,
        user: null,
        error: error.message || 'Failed to fetch user'
      });
    }
  },

  CreateUser: (call: any, callback: any) => {
    try {
      const { name, email, age, department } = call.request;
      
      // Validate required fields
      if (!name || !email || !age || !department) {
        return callback(null, {
          success: false,
          user: null,
          error: 'Missing required fields: name, email, age, department'
        });
      }
      
      // Check if email already exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        return callback(null, {
          success: false,
          user: null,
          error: 'User with this email already exists'
        });
      }
      
      const newUser: User = {
        id: uuidv4(),
        name,
        email,
        age,
        department,
        isActive: true,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      
      const protoUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        age: newUser.age,
        department: newUser.department,
        is_active: newUser.isActive,
        created_at: newUser.createdAt
      };
      
      callback(null, {
        success: true,
        user: protoUser,
        error: ''
      });
    } catch (error: any) {
      callback(null, {
        success: false,
        user: null,
        error: error.message || 'Failed to create user'
      });
    }
  },

  UpdateUser: (call: any, callback: any) => {
    try {
      const { id, name, email, age, department, is_active } = call.request;
      
      const userIndex = users.findIndex(u => u.id === id);
      
      if (userIndex === -1) {
        return callback(null, {
          success: false,
          user: null,
          error: `User with id ${id} not found`
        });
      }
      
      // Update user with provided fields
      const updatedUser: User = {
        ...users[userIndex],
        ...(name && { name }),
        ...(email && { email }),
        ...(age && { age }),
        ...(department && { department }),
        ...(is_active !== undefined && { isActive: is_active })
      };
      
      users[userIndex] = updatedUser;
      
      const protoUser = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        age: updatedUser.age,
        department: updatedUser.department,
        is_active: updatedUser.isActive,
        created_at: updatedUser.createdAt
      };
      
      callback(null, {
        success: true,
        user: protoUser,
        error: ''
      });
    } catch (error: any) {
      callback(null, {
        success: false,
        user: null,
        error: error.message || 'Failed to update user'
      });
    }
  },

  DeleteUser: (call: any, callback: any) => {
    try {
      const { id } = call.request;
      
      const userIndex = users.findIndex(u => u.id === id);
      
      if (userIndex === -1) {
        return callback(null, {
          success: false,
          message: '',
          user: null,
          error: `User with id ${id} not found`
        });
      }
      
      const deletedUser = users.splice(userIndex, 1)[0];
      
      const protoUser = {
        id: deletedUser.id,
        name: deletedUser.name,
        email: deletedUser.email,
        age: deletedUser.age,
        department: deletedUser.department,
        is_active: deletedUser.isActive,
        created_at: deletedUser.createdAt
      };
      
      callback(null, {
        success: true,
        message: 'User deleted successfully',
        user: protoUser,
        error: ''
      });
    } catch (error: any) {
      callback(null, {
        success: false,
        message: '',
        user: null,
        error: error.message || 'Failed to delete user'
      });
    }
  }
};

export function startGrpcServer(port: number): void {
  const server = new grpc.Server();
  
  server.addService(userProto.UserService.service, userService);
  
  server.bindAsync(
    `0.0.0.0:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        console.error('❌ Failed to start gRPC server:', error);
        return;
      }
      console.log(`⚡ Service1 gRPC server running on port ${port}`);
    }
  );
}