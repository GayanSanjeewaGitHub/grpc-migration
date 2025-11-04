import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

// Service URLs
const SERVICE1_URL = process.env.SERVICE1_URL || 'http://localhost:3001';
const SERVICE2_URL = process.env.SERVICE2_URL || 'http://localhost:3002';

// BFF endpoint to get users from Service1
router.get('/users', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${SERVICE1_URL}/api/users`);
    res.json({
      source: 'service1-rest',
      data: response.data
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch users from Service1',
      details: error.message
    });
  }
});

// BFF endpoint to get products from Service2
router.get('/products', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${SERVICE2_URL}/api/products`);
    res.json({
      source: 'service2-rest',
      data: response.data
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch products from Service2',
      details: error.message
    });
  }
});

// BFF endpoint to get user details from Service1
router.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${SERVICE1_URL}/api/users/${id}`);
    res.json({
      source: 'service1-rest',
      data: response.data
    });
  } catch (error: any) {
    res.status(500).json({
      error: `Failed to fetch user ${req.params.id} from Service1`,
      details: error.message
    });
  }
});

// BFF endpoint to get product details from Service2
router.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${SERVICE2_URL}/api/products/${id}`);
    res.json({
      source: 'service2-rest',
      data: response.data
    });
  } catch (error: any) {
    res.status(500).json({
      error: `Failed to fetch product ${req.params.id} from Service2`,
      details: error.message
    });
  }
});

// BFF endpoint to get combined data from both services
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const [usersResponse, productsResponse] = await Promise.all([
      axios.get(`${SERVICE1_URL}/api/users`),
      axios.get(`${SERVICE2_URL}/api/products`)
    ]);

    res.json({
      users: {
        source: 'service1-rest',
        data: usersResponse.data
      },
      products: {
        source: 'service2-rest',
        data: productsResponse.data
      }
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch dashboard data',
      details: error.message
    });
  }
});

export { router as restRoutes };