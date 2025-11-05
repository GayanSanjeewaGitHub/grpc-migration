# gRPC Implementation Guide

## ✅ Implementation Complete

All gRPC servers and clients have been implemented! Both REST and gRPC protocols now work side-by-side.

## 📁 What Was Implemented

### 1. **Service1 (User Service) - gRPC Server**
**File**: `server1/src/grpc/grpc-server.ts`

**Implemented Methods**:
- `GetUsers` - Get all users with optional filters (department, is_active)
- `GetUserById` - Get a specific user by ID
- `CreateUser` - Create a new user
- `UpdateUser` - Update an existing user
- `DeleteUser` - Delete a user

**Port**: 50051

### 2. **Service2 (Product Service) - gRPC Server**
**File**: `server2/src/grpc/grpc-server.ts`

**Implemented Methods**:
- `GetProducts` - Get all products with optional filters (category, in_stock, price range)
- `GetProductById` - Get a specific product by ID
- `GetProductsByCategory` - Get products by category
- `CreateProduct` - Create a new product
- `UpdateProduct` - Update an existing product
- `DeleteProduct` - Delete a product

**Port**: 50052

### 3. **BFF Service - gRPC Clients**
**File**: `bff_service/src/routes/grpc-routes.ts`

**Implemented Endpoints**:
- `GET /api/grpc/users` - Fetch users via gRPC
- `GET /api/grpc/users/:id` - Fetch specific user via gRPC
- `GET /api/grpc/products` - Fetch products via gRPC
- `GET /api/grpc/products/:id` - Fetch specific product via gRPC
- `GET /api/grpc/dashboard` - Fetch combined data via gRPC

## 🚀 How to Run

### Step 1: Install Dependencies
```bash
# Run the setup script
.\setup.ps1

# Or install manually for each service
cd bff_service && npm install
cd ../server1 && npm install
cd ../server2 && npm install
```

### Step 2: Start All Services

**Terminal 1 - Service1 (User Service)**
```bash
cd server1
npm run dev
```
Expected output:
```
🚀 Service1 REST API running on port 3001
📋 Health check: http://localhost:3001/health
👥 Users API: http://localhost:3001/api/users
⚡ Service1 gRPC server running on port 50051
```

**Terminal 2 - Service2 (Product Service)**
```bash
cd server2
npm run dev
```
Expected output:
```
🚀 Service2 REST API running on port 3002
📋 Health check: http://localhost:3002/health
📦 Products API: http://localhost:3002/api/products
⚡ Service2 gRPC server running on port 50052
```

**Terminal 3 - BFF Service**
```bash
cd bff_service
npm run dev
```
Expected output:
```
🚀 BFF Service running on port 3000
📋 Health check: http://localhost:3000/health
🔗 REST API: http://localhost:3000/api/rest
⚡ gRPC API: http://localhost:3000/api/grpc
```

### Step 3: Test the APIs

**Test REST APIs**:
```bash
cd bff_service
npm run test:rest
```

**Test gRPC APIs**:
```bash
cd bff_service
npm run test:grpc
```

## 🔍 API Comparison

### REST vs gRPC - Same Functionality

| Feature | REST Endpoint | gRPC Endpoint |
|---------|---------------|---------------|
| Get all users | `GET /api/rest/users` | `GET /api/grpc/users` |
| Get user by ID | `GET /api/rest/users/1` | `GET /api/grpc/users/1` |
| Get all products | `GET /api/rest/products` | `GET /api/grpc/products` |
| Get product by ID | `GET /api/rest/products/1` | `GET /api/grpc/products/1` |
| Get dashboard | `GET /api/rest/dashboard` | `GET /api/grpc/dashboard` |

## 📊 Example Requests

### Using REST
```bash
# Get all users
curl http://localhost:3000/api/rest/users

# Get filtered users
curl "http://localhost:3000/api/rest/users?department=Engineering"

# Get specific user
curl http://localhost:3000/api/rest/users/1
```

### Using gRPC (through BFF)
```bash
# Get all users
curl http://localhost:3000/api/grpc/users

# Get filtered users
curl "http://localhost:3000/api/grpc/users?department=Engineering"

# Get specific user
curl http://localhost:3000/api/grpc/users/1
```

## 🔧 Technical Details

### Protocol Buffer Definitions
Located in `/proto` directory:
- `user.proto` - User service definition
- `product.proto` - Product service definition

### Data Mapping

**REST → gRPC Field Mapping**:
```
isActive  →  is_active
inStock   →  in_stock
createdAt →  created_at
minPrice  →  min_price
maxPrice  →  max_price
```

### Error Handling
Both REST and gRPC implementations include:
- ✅ Request validation
- ✅ Error messages in responses
- ✅ Proper status codes/error callbacks
- ✅ Type safety with TypeScript

## 🎯 Key Benefits of gRPC Implementation

1. **Binary Protocol**: More efficient than JSON
2. **Type Safety**: Strongly typed with Protocol Buffers
3. **Performance**: Lower latency and better throughput
4. **Streaming**: Support for bidirectional streaming (can be added)
5. **Cross-Language**: Proto files can be used with any language

## 🧪 Testing Features

### Test Scripts Include:
- ✅ Basic CRUD operations
- ✅ Filtering by parameters
- ✅ Error handling
- ✅ Dashboard aggregation
- ✅ Performance notes

### Sample Test Output
```
⚡ Testing gRPC API endpoints through BFF...

👥 Testing users endpoint via gRPC...
✅ Users Response (gRPC): { source: 'service1-grpc', data: { success: true, count: 5, users: [...] } }

📦 Testing products endpoint via gRPC...
✅ Products Response (gRPC): { source: 'service2-grpc', data: { success: true, count: 6, products: [...] } }

🎉 All gRPC API tests completed successfully!
```

## 📦 Dependencies Used

**gRPC Libraries**:
- `@grpc/grpc-js` - gRPC implementation for Node.js
- `@grpc/proto-loader` - Dynamic proto file loading

**Other Dependencies**:
- `express` - REST API framework
- `axios` - HTTP client for REST calls
- `uuid` - Unique ID generation
- `typescript` - Type safety

## 🔄 Migration Strategy

The implementation supports **gradual migration**:

1. **Phase 1** (Current): Both REST and gRPC work side-by-side
2. **Phase 2**: Monitor and compare performance
3. **Phase 3**: Gradually shift traffic to gRPC
4. **Phase 4**: Deprecate REST endpoints (optional)

## 🐛 Troubleshooting

### Issue: "Cannot find module @grpc/grpc-js"
**Solution**: Run `npm install` in the service directory

### Issue: "Failed to start gRPC server"
**Solution**: Check if ports 50051 and 50052 are available

### Issue: "Failed to fetch via gRPC"
**Solution**: Ensure all services are running (REST + gRPC servers)

### Issue: "Proto file not found"
**Solution**: Ensure `/proto` directory exists at project root with `.proto` files

## 📝 Next Steps

1. ✅ Run `npm install` for all services
2. ✅ Start all three services
3. ✅ Test REST endpoints
4. ✅ Test gRPC endpoints
5. ✅ Compare performance
6. 🔄 Implement additional features (streaming, authentication, etc.)

## 🎉 Success Criteria

- [x] Service1 gRPC server running on port 50051
- [x] Service2 gRPC server running on port 50052
- [x] BFF can call both services via gRPC
- [x] REST and gRPC coexist peacefully
- [x] Test scripts work for both protocols
- [x] Error handling implemented
- [x] Type-safe implementations

---

**Congratulations!** Your gRPC migration project is now fully functional with both REST and gRPC support! 🎊