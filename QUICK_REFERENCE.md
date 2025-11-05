# Quick Reference - REST vs gRPC Endpoints

## 🌐 Service Ports

| Service | REST Port | gRPC Port |
|---------|-----------|-----------|
| BFF Service | 3000 | - |
| Service1 (Users) | 3001 | 50051 |
| Service2 (Products) | 3002 | 50052 |

## 📋 BFF Endpoints

### REST API (`/api/rest`)

```bash
# Users
GET  http://localhost:3000/api/rest/users
GET  http://localhost:3000/api/rest/users/:id
GET  http://localhost:3000/api/rest/users?department=Engineering
GET  http://localhost:3000/api/rest/users?isActive=true

# Products
GET  http://localhost:3000/api/rest/products
GET  http://localhost:3000/api/rest/products/:id
GET  http://localhost:3000/api/rest/products?category=Electronics
GET  http://localhost:3000/api/rest/products?inStock=true
GET  http://localhost:3000/api/rest/products?minPrice=50&maxPrice=200

# Dashboard
GET  http://localhost:3000/api/rest/dashboard
```

### gRPC API (`/api/grpc`)

```bash
# Users
GET  http://localhost:3000/api/grpc/users
GET  http://localhost:3000/api/grpc/users/:id
GET  http://localhost:3000/api/grpc/users?department=Engineering
GET  http://localhost:3000/api/grpc/users?isActive=true

# Products
GET  http://localhost:3000/api/grpc/products
GET  http://localhost:3000/api/grpc/products/:id
GET  http://localhost:3000/api/grpc/products?category=Electronics
GET  http://localhost:3000/api/grpc/products?inStock=true
GET  http://localhost:3000/api/grpc/products?minPrice=50&maxPrice=200

# Dashboard
GET  http://localhost:3000/api/grpc/dashboard
```

## 🧪 Quick Test Commands

### PowerShell - Start All Services

```powershell
# Terminal 1
cd server1; npm run dev

# Terminal 2
cd server2; npm run dev

# Terminal 3
cd bff_service; npm run dev
```

### Test REST
```bash
cd bff_service
npm run test:rest
```

### Test gRPC
```bash
cd bff_service
npm run test:grpc
```

### Manual cURL Tests

```bash
# REST - Get all users
curl http://localhost:3000/api/rest/users

# gRPC - Get all users
curl http://localhost:3000/api/grpc/users

# REST - Get user by ID
curl http://localhost:3000/api/rest/users/1

# gRPC - Get user by ID
curl http://localhost:3000/api/grpc/users/1

# REST - Dashboard
curl http://localhost:3000/api/rest/dashboard

# gRPC - Dashboard
curl http://localhost:3000/api/grpc/dashboard
```

## 📊 Response Format

### REST Response
```json
{
  "source": "service1-rest",
  "data": {
    "success": true,
    "count": 5,
    "data": [...]
  }
}
```

### gRPC Response
```json
{
  "source": "service1-grpc",
  "data": {
    "success": true,
    "count": 5,
    "users": [...]
  }
}
```

## 🔍 Mock Data

### Users (5 records)
- John Doe (Engineering)
- Jane Smith (Marketing)
- Bob Johnson (Sales)
- Alice Brown (Engineering)
- Charlie Wilson (HR)

### Products (6 records)
- Laptop Pro 15 (Electronics)
- Wireless Mouse (Electronics)
- Office Chair (Furniture)
- Coffee Maker (Appliances)
- Notebook Set (Stationery)
- Wireless Headphones (Electronics)

## ⚡ Performance Notes

**gRPC Advantages**:
- Binary protocol (faster)
- HTTP/2 multiplexing
- Smaller payload size
- Built-in code generation
- Better for microservices

**REST Advantages**:
- Human-readable (JSON)
- Browser-friendly
- Simpler debugging
- Wider tool support
- Easier caching

---

**Pro Tip**: Use REST for external APIs, gRPC for internal microservices communication!