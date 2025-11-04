import { Product } from '../models/product';

// Mock product data
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop Pro 15',
    description: 'High-performance laptop with 16GB RAM and 512GB SSD',
    price: 1299.99,
    category: 'Electronics',
    inStock: true,
    quantity: 25,
    createdAt: '2024-01-10T08:00:00Z'
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precise tracking',
    price: 39.99,
    category: 'Electronics',
    inStock: true,
    quantity: 100,
    createdAt: '2024-01-15T12:30:00Z'
  },
  {
    id: '3',
    name: 'Office Chair',
    description: 'Comfortable ergonomic office chair with lumbar support',
    price: 249.99,
    category: 'Furniture',
    inStock: false,
    quantity: 0,
    createdAt: '2024-02-01T10:15:00Z'
  },
  {
    id: '4',
    name: 'Coffee Maker',
    description: 'Automatic drip coffee maker with programmable timer',
    price: 89.99,
    category: 'Appliances',
    inStock: true,
    quantity: 15,
    createdAt: '2024-02-10T14:45:00Z'
  },
  {
    id: '5',
    name: 'Notebook Set',
    description: 'Premium leather-bound notebooks, pack of 3',
    price: 24.99,
    category: 'Stationery',
    inStock: true,
    quantity: 50,
    createdAt: '2024-02-20T09:20:00Z'
  },
  {
    id: '6',
    name: 'Wireless Headphones',
    description: 'Noise-cancelling wireless headphones with 30-hour battery',
    price: 199.99,
    category: 'Electronics',
    inStock: true,
    quantity: 35,
    createdAt: '2024-03-01T16:10:00Z'
  }
];

// In-memory database simulation
let products: Product[] = [...mockProducts];