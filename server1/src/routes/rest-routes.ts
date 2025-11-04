import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { mockUsers } from '../data/mock-users';
import { User, CreateUserRequest, UpdateUserRequest } from '../models/user';

const router = Router();

// In-memory database simulation
let users: User[] = [...mockUsers];

// GET /api/users - Get all users
router.get('/users', (req: Request, res: Response) => {
  try {
    // Support query parameters for filtering
    const { department, isActive } = req.query;
    
    let filteredUsers = users;
    
    if (department) {
      filteredUsers = filteredUsers.filter(user => 
        user.department.toLowerCase() === (department as string).toLowerCase()
      );
    }
    
    if (isActive !== undefined) {
      const activeStatus = isActive === 'true';
      filteredUsers = filteredUsers.filter(user => user.isActive === activeStatus);
    }
    
    res.json({
      success: true,
      count: filteredUsers.length,
      data: filteredUsers
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      details: error.message
    });
  }
});

// GET /api/users/:id - Get user by ID
router.get('/users/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = users.find(u => u.id === id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        id
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
      details: error.message
    });
  }
});

// POST /api/users - Create new user
router.post('/users', (req: Request, res: Response) => {
  try {
    const createRequest: CreateUserRequest = req.body;
    
    // Validate required fields
    if (!createRequest.name || !createRequest.email || !createRequest.age || !createRequest.department) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, age, department'
      });
    }
    
    // Check if email already exists
    const existingUser = users.find(u => u.email === createRequest.email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }
    
    const newUser: User = {
      id: uuidv4(),
      name: createRequest.name,
      email: createRequest.email,
      age: createRequest.age,
      department: createRequest.department,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
      details: error.message
    });
  }
});

// PUT /api/users/:id - Update user
router.put('/users/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateRequest: UpdateUserRequest = req.body;
    
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        id
      });
    }
    
    // Update user with provided fields
    const updatedUser: User = {
      ...users[userIndex],
      ...updateRequest
    };
    
    users[userIndex] = updatedUser;
    
    res.json({
      success: true,
      data: updatedUser
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
      details: error.message
    });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/users/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        id
      });
    }
    
    const deletedUser = users.splice(userIndex, 1)[0];
    
    res.json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
      details: error.message
    });
  }
});

export { router as restRoutes };