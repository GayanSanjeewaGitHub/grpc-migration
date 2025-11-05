import { Router, Request, Response } from 'express';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const router = Router();

// Load proto files
const USER_PROTO_PATH = path.join(__dirname, '../../../proto/user.proto');
const PRODUCT_PROTO_PATH = path.join(__dirname, '../../../proto/product.proto');

const userPackageDefinition = protoLoader.loadSync(USER_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const productPackageDefinition = protoLoader.loadSync(PRODUCT_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const userProto: any = grpc.loadPackageDefinition(userPackageDefinition).user;
const productProto: any = grpc.loadPackageDefinition(productPackageDefinition).product;

// Service URLs
const SERVICE1_GRPC_URL = process.env.SERVICE1_GRPC_URL || 'localhost:50051';
const SERVICE2_GRPC_URL = process.env.SERVICE2_GRPC_URL || 'localhost:50052';

// Create gRPC clients
const userClient = new userProto.UserService(
  SERVICE1_GRPC_URL,
  grpc.credentials.createInsecure()
);

const productClient = new productProto.ProductService(
  SERVICE2_GRPC_URL,
  grpc.credentials.createInsecure()
);

// BFF gRPC endpoint to get users from Service1
router.get('/users', async (req: Request, res: Response) => {
  try {
    const { department, isActive } = req.query;
    
    const request: any = {};
    if (department) request.department = department;
    if (isActive !== undefined) request.is_active = isActive === 'true';
    
    userClient.GetUsers(request, (error: any, response: any) => {
      if (error) {
        return res.status(500).json({
          error: 'Failed to fetch users from Service1 via gRPC',
          details: error.message
        });
      }
      
      res.json({
        source: 'service1-grpc',
        data: response
      });
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch users from Service1 via gRPC',
      details: error.message
    });
  }
});

// BFF gRPC endpoint to get products from Service2
router.get('/products', async (req: Request, res: Response) => {
  try {
    const { category, inStock, minPrice, maxPrice } = req.query;
    
    const request: any = {};
    if (category) request.category = category;
    if (inStock !== undefined) request.in_stock = inStock === 'true';
    if (minPrice) request.min_price = parseFloat(minPrice as string);
    if (maxPrice) request.max_price = parseFloat(maxPrice as string);
    
    productClient.GetProducts(request, (error: any, response: any) => {
      if (error) {
        return res.status(500).json({
          error: 'Failed to fetch products from Service2 via gRPC',
          details: error.message
        });
      }
      
      res.json({
        source: 'service2-grpc',
        data: response
      });
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch products from Service2 via gRPC',
      details: error.message
    });
  }
});

// BFF gRPC endpoint to get user details from Service1
router.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    userClient.GetUserById({ id }, (error: any, response: any) => {
      if (error) {
        return res.status(500).json({
          error: `Failed to fetch user ${id} from Service1 via gRPC`,
          details: error.message
        });
      }
      
      res.json({
        source: 'service1-grpc',
        data: response
      });
    });
  } catch (error: any) {
    res.status(500).json({
      error: `Failed to fetch user ${req.params.id} from Service1 via gRPC`,
      details: error.message
    });
  }
});

// BFF gRPC endpoint to get product details from Service2
router.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    productClient.GetProductById({ id }, (error: any, response: any) => {
      if (error) {
        return res.status(500).json({
          error: `Failed to fetch product ${id} from Service2 via gRPC`,
          details: error.message
        });
      }
      
      res.json({
        source: 'service2-grpc',
        data: response
      });
    });
  } catch (error: any) {
    res.status(500).json({
      error: `Failed to fetch product ${req.params.id} from Service2 via gRPC`,
      details: error.message
    });
  }
});

// BFF gRPC endpoint to get combined data from both services
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    // Create promises for both gRPC calls
    const getUsersPromise = new Promise((resolve, reject) => {
      userClient.GetUsers({}, (error: any, response: any) => {
        if (error) reject(error);
        else resolve(response);
      });
    });
    
    const getProductsPromise = new Promise((resolve, reject) => {
      productClient.GetProducts({}, (error: any, response: any) => {
        if (error) reject(error);
        else resolve(response);
      });
    });
    
    const [usersResponse, productsResponse] = await Promise.all([
      getUsersPromise,
      getProductsPromise
    ]);
    
    res.json({
      users: {
        source: 'service1-grpc',
        data: usersResponse
      },
      products: {
        source: 'service2-grpc',
        data: productsResponse
      }
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch dashboard data via gRPC',
      details: error.message
    });
  }
});

export { router as grpcRoutes };