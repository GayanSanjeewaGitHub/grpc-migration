import express from 'express';
import cors from 'cors';
import { restRoutes } from './routes/rest-routes';
import { startGrpcServer } from './grpc/grpc-server';

const app = express();
const REST_PORT = process.env.REST_PORT || 3002;
const GRPC_PORT = process.env.GRPC_PORT || 50052;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', restRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'service2',
    rest_port: REST_PORT,
    grpc_port: GRPC_PORT
  });
});

// Start servers
app.listen(REST_PORT, () => {
  console.log(`🚀 Service2 REST API running on port ${REST_PORT}`);
  console.log(`📋 Health check: http://localhost:${REST_PORT}/health`);
  console.log(`📦 Products API: http://localhost:${REST_PORT}/api/products`);
});

// Start gRPC server
startGrpcServer(GRPC_PORT as number);