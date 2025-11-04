import express from 'express';
import cors from 'cors';
import { restRoutes } from './routes/rest-routes';
import { grpcRoutes } from './routes/grpc-routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/rest', restRoutes);
app.use('/api/grpc', grpcRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'bff-service' });
});

app.listen(PORT, () => {
  console.log(`🚀 BFF Service running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 REST API: http://localhost:${PORT}/api/rest`);
  console.log(`⚡ gRPC API: http://localhost:${PORT}/api/grpc`);
});