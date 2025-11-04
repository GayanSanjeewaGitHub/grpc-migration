# gRPC Migration Project

This project demonstrates a migration from REST to gRPC architecture using Node.js TypeScript services.

## Project Structure

```
├── bff_service/          # Backend for Frontend service
├── server1/              # User Management Service (Service1)
├── server2/              # Product Management Service (Service2)
└── README.md
```

## Services Overview

### BFF Service (Port 3000)
- **Purpose**: Backend for Frontend that aggregates data from Service1 and Service2
- **REST Endpoints**: `/api/rest/*`
- **gRPC Endpoints**: `/api/grpc/*` (planned)
- **Health Check**: `http://localhost:3000/health`

### Service1 - User Management (Port 3001/50051)
- **Purpose**: Manages user data and operations
- **REST Port**: 3001
- **gRPC Port**: 50051 (planned)
- **Endpoints**:
  - `GET /api/users` - Get all users
  - `GET /api/users/:id` - Get user by ID
  - `POST /api/users` - Create new user
  - `PUT /api/users/:id` - Update user
  - `DELETE /api/users/:id` - Delete user

### Service2 - Product Management (Port 3002/50052)
- **Purpose**: Manages product catalog and inventory
- **REST Port**: 3002
- **gRPC Port**: 50052 (planned)
- **Endpoints**:
  - `GET /api/products` - Get all products
  - `GET /api/products/:id` - Get product by ID
  - `POST /api/products` - Create new product
  - `PUT /api/products/:id` - Update product
  - `DELETE /api/products/:id` - Delete product
  - `GET /api/products/category/:category` - Get products by category

## Quick Start

### 1. Install Dependencies

```bash
# Install dependencies for all services
cd bff_service && npm install
cd ../server1 && npm install
cd ../server2 && npm install
```

### 2. Start Services

Open 3 terminal windows:

**Terminal 1 - Service1:**
```bash
cd server1
npm run dev
```

**Terminal 2 - Service2:**
```bash
cd server2
npm run dev
```

**Terminal 3 - BFF Service:**
```bash
cd bff_service
npm run dev
```

### 3. Test REST APIs

```bash
cd bff_service
npm run test:rest
```

## API Examples

### BFF Service Endpoints

```bash
# Get all users through BFF
curl http://localhost:3000/api/rest/users

# Get all products through BFF
curl http://localhost:3000/api/rest/products

# Get dashboard data (combined users and products)
curl http://localhost:3000/api/rest/dashboard

# Get specific user
curl http://localhost:3000/api/rest/users/1

# Get specific product
curl http://localhost:3000/api/rest/products/1
```

### Direct Service Access

**Service1 (Users):**
```bash
# Get all users
curl http://localhost:3001/api/users

# Create new user
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New User",
    "email": "new.user@company.com",
    "age": 25,
    "department": "IT"
  }'

# Filter by department
curl "http://localhost:3001/api/users?department=Engineering"

# Filter by active status
curl "http://localhost:3001/api/users?isActive=true"
```

**Service2 (Products):**
```bash
# Get all products
curl http://localhost:3002/api/products

# Create new product
curl -X POST http://localhost:3002/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "description": "A new product description",
    "price": 99.99,
    "category": "Electronics",
    "quantity": 10
  }'

# Filter by category
curl "http://localhost:3002/api/products?category=Electronics"

# Filter by stock status
curl "http://localhost:3002/api/products?inStock=true"

# Filter by price range
curl "http://localhost:3002/api/products?minPrice=50&maxPrice=200"
```

## Mock Data

### Users (Service1)
- John Doe (Engineering)
- Jane Smith (Marketing)
- Bob Johnson (Sales)
- Alice Brown (Engineering)
- Charlie Wilson (HR)

### Products (Service2)
- Electronics: Laptop Pro 15, Wireless Mouse, Wireless Headphones
- Furniture: Office Chair
- Appliances: Coffee Maker
- Stationery: Notebook Set

## Migration Plan

### Phase 1: ✅ REST Implementation
- [x] Set up basic TypeScript Node.js services
- [x] Implement REST APIs with mock data
- [x] Create BFF service that calls Service1 and Service2
- [x] Add test scripts for REST endpoints

### Phase 2: 🚧 gRPC Protocol Definition
- [ ] Create .proto files for User and Product services
- [ ] Generate TypeScript types from proto files
- [ ] Set up build process for proto compilation

### Phase 3: 🚧 gRPC Implementation
- [ ] Implement gRPC servers in Service1 and Service2
- [ ] Create gRPC clients in BFF service
- [ ] Add gRPC endpoints alongside REST endpoints

### Phase 4: 🚧 Testing & Validation
- [ ] Create gRPC test scripts
- [ ] Performance comparison between REST and gRPC
- [ ] Error handling and monitoring

## Development Commands

### BFF Service
```bash
cd bff_service
npm run dev          # Start development server
npm run build        # Build TypeScript
npm run start        # Start production server
npm run test:rest    # Test REST endpoints
npm run test:grpc    # Test gRPC endpoints (planned)
```

### Service1
```bash
cd server1
npm run dev          # Start development server
npm run build        # Build TypeScript
npm run start        # Start production server
npm run proto:generate  # Generate gRPC code (planned)
```

### Service2
```bash
cd server2
npm run dev          # Start development server
npm run build        # Build TypeScript
npm run start        # Start production server
npm run proto:generate  # Generate gRPC code (planned)
```

## Health Checks

- BFF Service: http://localhost:3000/health
- Service1: http://localhost:3001/health
- Service2: http://localhost:3002/health

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **REST Framework**: Express.js
- **gRPC**: @grpc/grpc-js, @grpc/proto-loader
- **HTTP Client**: Axios
- **Development**: ts-node, nodemon

## Next Steps

1. Install dependencies for all services
2. Start all services in development mode
3. Run REST API tests to verify functionality
4. Proceed with gRPC protocol definition and implementation

The project is designed to support both REST and gRPC protocols simultaneously, allowing for gradual migration and A/B testing.