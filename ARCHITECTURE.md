# Architecture Diagram - gRPC Migration Project

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT / BROWSER                           │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP Requests
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         BFF SERVICE (Port 3000)                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────┐              ┌──────────────────────┐    │
│  │   REST Routes        │              │   gRPC Routes        │    │
│  │   /api/rest/*        │              │   /api/grpc/*        │    │
│  └──────────────────────┘              └──────────────────────┘    │
│           │                                      │                   │
│           │                                      │                   │
└───────────┼──────────────────────────────────────┼───────────────────┘
            │                                      │
            │                                      │
    ┌───────┴─────────┐                   ┌────────┴─────────┐
    │                 │                   │                   │
    │  Axios HTTP     │                   │  gRPC Clients    │
    │  Calls          │                   │  (Binary)        │
    │                 │                   │                   │
    └───────┬─────────┘                   └────────┬─────────┘
            │                                      │
            ▼                                      ▼
┌───────────────────────┐           ┌───────────────────────┐
│   SERVICE 1 (Users)   │           │   SERVICE 1 (Users)   │
│   REST: Port 3001     │           │   gRPC: Port 50051    │
├───────────────────────┤           ├───────────────────────┤
│                       │           │                       │
│  Express.js Server    │           │  gRPC Server          │
│  ┌─────────────────┐ │           │  ┌─────────────────┐ │
│  │ REST Endpoints  │ │           │  │ UserService     │ │
│  │ - GET /users    │ │           │  │ - GetUsers()    │ │
│  │ - GET /users/:id│ │           │  │ - GetUserById() │ │
│  │ - POST /users   │ │           │  │ - CreateUser()  │ │
│  │ - PUT /users/:id│ │           │  │ - UpdateUser()  │ │
│  │ - DELETE /users │ │           │  │ - DeleteUser()  │ │
│  └─────────────────┘ │           │  └─────────────────┘ │
│           │           │           │           │           │
│           ▼           │           │           ▼           │
│  ┌─────────────────┐ │           │  ┌─────────────────┐ │
│  │  Mock User Data │ │           │  │  Mock User Data │ │
│  │  (5 users)      │◄┼───────────┼─►│  (5 users)      │ │
│  └─────────────────┘ │           │  └─────────────────┘ │
└───────────────────────┘           └───────────────────────┘

┌───────────────────────┐           ┌───────────────────────┐
│  SERVICE 2 (Products) │           │  SERVICE 2 (Products) │
│  REST: Port 3002      │           │  gRPC: Port 50052     │
├───────────────────────┤           ├───────────────────────┤
│                       │           │                       │
│  Express.js Server    │           │  gRPC Server          │
│  ┌─────────────────┐ │           │  ┌─────────────────┐ │
│  │ REST Endpoints  │ │           │  │ ProductService  │ │
│  │ - GET /products │ │           │  │ - GetProducts() │ │
│  │ - GET /prod/:id │ │           │  │ - GetProductById│ │
│  │ - POST /products│ │           │  │ - CreateProduct │ │
│  │ - PUT /prod/:id │ │           │  │ - UpdateProduct │ │
│  │ - DELETE /prod  │ │           │  │ - DeleteProduct │ │
│  └─────────────────┘ │           │  └─────────────────┘ │
│           │           │           │           │           │
│           ▼           │           │           ▼           │
│  ┌─────────────────┐ │           │  ┌─────────────────┐ │
│  │Mock Product Data│ │           │  │Mock Product Data│ │
│  │  (6 products)   │◄┼───────────┼─►│  (6 products)   │ │
│  └─────────────────┘ │           │  └─────────────────┘ │
└───────────────────────┘           └───────────────────────┘
```

## Protocol Comparison

### REST Flow
```
Client → BFF (HTTP/JSON) → Service1/2 (HTTP/JSON) → Response (JSON)
```

### gRPC Flow
```
Client → BFF (HTTP/JSON) → Service1/2 (gRPC/Protobuf) → Response (Protobuf→JSON)
```

## Request Flow Example

### REST Request Flow
```
1. Client: GET http://localhost:3000/api/rest/users
2. BFF: Receives REST request
3. BFF: Makes HTTP call to http://localhost:3001/api/users
4. Service1: Processes REST request
5. Service1: Returns JSON response
6. BFF: Forwards JSON response to client
```

### gRPC Request Flow
```
1. Client: GET http://localhost:3000/api/grpc/users
2. BFF: Receives REST request
3. BFF: Makes gRPC call to localhost:50051 → GetUsers()
4. Service1: Processes gRPC request
5. Service1: Returns Protobuf response
6. BFF: Converts Protobuf to JSON
7. BFF: Returns JSON response to client
```

## Data Flow

### User Service (Service1)
```
┌──────────────┐
│   Client     │
└──────┬───────┘
       │
       │ GET /api/rest/users OR /api/grpc/users
       ▼
┌──────────────┐
│  BFF Service │
└──────┬───────┘
       │
       ├─────► REST: axios.get('http://localhost:3001/api/users')
       │
       └─────► gRPC: userClient.GetUsers({})
       │
       ▼
┌──────────────┐
│  Service1    │
│              │
│  Users:      │
│  - John Doe  │
│  - Jane Smith│
│  - Bob...    │
└──────┬───────┘
       │
       │ Response
       ▼
   Back to Client
```

### Product Service (Service2)
```
┌──────────────┐
│   Client     │
└──────┬───────┘
       │
       │ GET /api/rest/products OR /api/grpc/products
       ▼
┌──────────────┐
│  BFF Service │
└──────┬───────┘
       │
       ├─────► REST: axios.get('http://localhost:3002/api/products')
       │
       └─────► gRPC: productClient.GetProducts({})
       │
       ▼
┌──────────────┐
│  Service2    │
│              │
│  Products:   │
│  - Laptop    │
│  - Mouse     │
│  - Chair...  │
└──────┬───────┘
       │
       │ Response
       ▼
   Back to Client
```

## Port Mapping

```
┌─────────────────────────────────────────────┐
│  Service         │  REST Port  │  gRPC Port │
├─────────────────────────────────────────────┤
│  BFF Service     │    3000     │     -      │
│  Service1 (User) │    3001     │   50051    │
│  Service2 (Prod) │    3002     │   50052    │
└─────────────────────────────────────────────┘
```

## Technology Stack

```
┌──────────────────────────────────────────────────────────┐
│                     Application Layer                     │
├──────────────────────────────────────────────────────────┤
│  TypeScript  │  Express.js  │  @grpc/grpc-js │  Axios   │
├──────────────────────────────────────────────────────────┤
│                    Protocol Layer                         │
├──────────────────────────────────────────────────────────┤
│      HTTP/1.1 + JSON      │    HTTP/2 + Protobuf        │
├──────────────────────────────────────────────────────────┤
│                    Transport Layer                        │
├──────────────────────────────────────────────────────────┤
│                       TCP/IP                              │
└──────────────────────────────────────────────────────────┘
```

## Protocol Buffer Schema

### User Proto
```protobuf
service UserService {
  rpc GetUsers(GetUsersRequest) returns (GetUsersResponse);
  rpc GetUserById(GetUserByIdRequest) returns (GetUserByIdResponse);
  rpc CreateUser(CreateUserRequest) returns (CreateUserResponse);
  rpc UpdateUser(UpdateUserRequest) returns (UpdateUserResponse);
  rpc DeleteUser(DeleteUserRequest) returns (DeleteUserResponse);
}
```

### Product Proto
```protobuf
service ProductService {
  rpc GetProducts(GetProductsRequest) returns (GetProductsResponse);
  rpc GetProductById(GetProductByIdRequest) returns (GetProductByIdResponse);
  rpc CreateProduct(CreateProductRequest) returns (CreateProductResponse);
  rpc UpdateProduct(UpdateProductRequest) returns (UpdateProductResponse);
  rpc DeleteProduct(DeleteProductRequest) returns (DeleteProductResponse);
}
```

## Deployment View

```
┌────────────────────────────────────────────────────────┐
│                   Development Mode                      │
├────────────────────────────────────────────────────────┤
│                                                         │
│  Terminal 1: Service1 (npm run dev)                   │
│  Terminal 2: Service2 (npm run dev)                   │
│  Terminal 3: BFF Service (npm run dev)                │
│                                                         │
│  All services run on localhost with ts-node            │
│                                                         │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│                   Production Mode                       │
├────────────────────────────────────────────────────────┤
│                                                         │
│  1. npm run build (compile TypeScript)                 │
│  2. npm start (run compiled JS)                        │
│                                                         │
│  OR containerize with Docker:                          │
│  - docker build -t service1 ./server1                  │
│  - docker build -t service2 ./server2                  │
│  - docker build -t bff ./bff_service                   │
│                                                         │
└────────────────────────────────────────────────────────┘
```

---

**Legend:**
- `→` HTTP/REST communication
- `⇒` gRPC communication
- `▼` Data flow
- `◄─►` Shared data access