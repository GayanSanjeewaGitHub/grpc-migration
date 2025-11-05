import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { mockProducts } from '../data/mock-products';
import { Product } from '../models/product';

// Load proto file
const PROTO_PATH = path.join(__dirname, '../../../proto/product.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const productProto: any = grpc.loadPackageDefinition(packageDefinition).product;

// In-memory database
let products: Product[] = [...mockProducts];

// gRPC Service Implementation
const productService = {
  GetProducts: (call: any, callback: any) => {
    try {
      const { category, in_stock, min_price, max_price } = call.request;
      
      let filteredProducts = products;
      
      // Apply filters if provided
      if (category) {
        filteredProducts = filteredProducts.filter(product => 
          product.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      if (in_stock !== undefined && in_stock !== null) {
        filteredProducts = filteredProducts.filter(product => product.inStock === in_stock);
      }
      
      if (min_price !== undefined && min_price !== null && min_price > 0) {
        filteredProducts = filteredProducts.filter(product => product.price >= min_price);
      }
      
      if (max_price !== undefined && max_price !== null && max_price > 0) {
        filteredProducts = filteredProducts.filter(product => product.price <= max_price);
      }
      
      // Convert Product objects to proto format
      const protoProducts = filteredProducts.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        in_stock: product.inStock,
        quantity: product.quantity,
        created_at: product.createdAt
      }));
      
      callback(null, {
        success: true,
        count: protoProducts.length,
        products: protoProducts,
        error: ''
      });
    } catch (error: any) {
      callback(null, {
        success: false,
        count: 0,
        products: [],
        error: error.message || 'Failed to fetch products'
      });
    }
  },

  GetProductById: (call: any, callback: any) => {
    try {
      const { id } = call.request;
      
      const product = products.find(p => p.id === id);
      
      if (!product) {
        return callback(null, {
          success: false,
          product: null,
          error: `Product with id ${id} not found`
        });
      }
      
      const protoProduct = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        in_stock: product.inStock,
        quantity: product.quantity,
        created_at: product.createdAt
      };
      
      callback(null, {
        success: true,
        product: protoProduct,
        error: ''
      });
    } catch (error: any) {
      callback(null, {
        success: false,
        product: null,
        error: error.message || 'Failed to fetch product'
      });
    }
  },

  GetProductsByCategory: (call: any, callback: any) => {
    try {
      const { category } = call.request;
      
      if (!category) {
        return callback(null, {
          success: false,
          category: '',
          count: 0,
          products: [],
          error: 'Category is required'
        });
      }
      
      const categoryProducts = products.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      );
      
      const protoProducts = categoryProducts.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        in_stock: product.inStock,
        quantity: product.quantity,
        created_at: product.createdAt
      }));
      
      callback(null, {
        success: true,
        category,
        count: protoProducts.length,
        products: protoProducts,
        error: ''
      });
    } catch (error: any) {
      callback(null, {
        success: false,
        category: '',
        count: 0,
        products: [],
        error: error.message || 'Failed to fetch products by category'
      });
    }
  },

  CreateProduct: (call: any, callback: any) => {
    try {
      const { name, description, price, category, quantity } = call.request;
      
      // Validate required fields
      if (!name || !description || price === undefined || !category || quantity === undefined) {
        return callback(null, {
          success: false,
          product: null,
          error: 'Missing required fields: name, description, price, category, quantity'
        });
      }
      
      const newProduct: Product = {
        id: uuidv4(),
        name,
        description,
        price,
        category,
        quantity,
        inStock: quantity > 0,
        createdAt: new Date().toISOString()
      };
      
      products.push(newProduct);
      
      const protoProduct = {
        id: newProduct.id,
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        category: newProduct.category,
        in_stock: newProduct.inStock,
        quantity: newProduct.quantity,
        created_at: newProduct.createdAt
      };
      
      callback(null, {
        success: true,
        product: protoProduct,
        error: ''
      });
    } catch (error: any) {
      callback(null, {
        success: false,
        product: null,
        error: error.message || 'Failed to create product'
      });
    }
  },

  UpdateProduct: (call: any, callback: any) => {
    try {
      const { id, name, description, price, category, in_stock, quantity } = call.request;
      
      const productIndex = products.findIndex(p => p.id === id);
      
      if (productIndex === -1) {
        return callback(null, {
          success: false,
          product: null,
          error: `Product with id ${id} not found`
        });
      }
      
      // Update product with provided fields
      const updatedProduct: Product = {
        ...products[productIndex],
        ...(name && { name }),
        ...(description && { description }),
        ...(price !== undefined && { price }),
        ...(category && { category }),
        ...(in_stock !== undefined && { inStock: in_stock }),
        ...(quantity !== undefined && { quantity, inStock: quantity > 0 })
      };
      
      products[productIndex] = updatedProduct;
      
      const protoProduct = {
        id: updatedProduct.id,
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: updatedProduct.price,
        category: updatedProduct.category,
        in_stock: updatedProduct.inStock,
        quantity: updatedProduct.quantity,
        created_at: updatedProduct.createdAt
      };
      
      callback(null, {
        success: true,
        product: protoProduct,
        error: ''
      });
    } catch (error: any) {
      callback(null, {
        success: false,
        product: null,
        error: error.message || 'Failed to update product'
      });
    }
  },

  DeleteProduct: (call: any, callback: any) => {
    try {
      const { id } = call.request;
      
      const productIndex = products.findIndex(p => p.id === id);
      
      if (productIndex === -1) {
        return callback(null, {
          success: false,
          message: '',
          product: null,
          error: `Product with id ${id} not found`
        });
      }
      
      const deletedProduct = products.splice(productIndex, 1)[0];
      
      const protoProduct = {
        id: deletedProduct.id,
        name: deletedProduct.name,
        description: deletedProduct.description,
        price: deletedProduct.price,
        category: deletedProduct.category,
        in_stock: deletedProduct.inStock,
        quantity: deletedProduct.quantity,
        created_at: deletedProduct.createdAt
      };
      
      callback(null, {
        success: true,
        message: 'Product deleted successfully',
        product: protoProduct,
        error: ''
      });
    } catch (error: any) {
      callback(null, {
        success: false,
        message: '',
        product: null,
        error: error.message || 'Failed to delete product'
      });
    }
  }
};

export function startGrpcServer(port: number): void {
  const server = new grpc.Server();
  
  server.addService(productProto.ProductService.service, productService);
  
  server.bindAsync(
    `0.0.0.0:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        console.error('❌ Failed to start gRPC server:', error);
        return;
      }
      console.log(`⚡ Service2 gRPC server running on port ${port}`);
    }
  );
}