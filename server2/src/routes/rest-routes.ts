import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { mockProducts } from '../data/mock-products';
import { Product, CreateProductRequest, UpdateProductRequest } from '../models/product';

const router = Router();

// In-memory database simulation
let products: Product[] = [...mockProducts];

// GET /api/products - Get all products
router.get('/products', (req: Request, res: Response) => {
  try {
    // Support query parameters for filtering
    const { category, inStock, minPrice, maxPrice } = req.query;
    
    let filteredProducts = products;
    
    if (category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === (category as string).toLowerCase()
      );
    }
    
    if (inStock !== undefined) {
      const stockStatus = inStock === 'true';
      filteredProducts = filteredProducts.filter(product => product.inStock === stockStatus);
    }
    
    if (minPrice) {
      const min = parseFloat(minPrice as string);
      filteredProducts = filteredProducts.filter(product => product.price >= min);
    }
    
    if (maxPrice) {
      const max = parseFloat(maxPrice as string);
      filteredProducts = filteredProducts.filter(product => product.price <= max);
    }
    
    res.json({
      success: true,
      count: filteredProducts.length,
      data: filteredProducts
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      details: error.message
    });
  }
});

// GET /api/products/:id - Get product by ID
router.get('/products/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = products.find(p => p.id === id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        id
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
      details: error.message
    });
  }
});

// POST /api/products - Create new product
router.post('/products', (req: Request, res: Response) => {
  try {
    const createRequest: CreateProductRequest = req.body;
    
    // Validate required fields
    if (!createRequest.name || !createRequest.description || createRequest.price === undefined || !createRequest.category || createRequest.quantity === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, description, price, category, quantity'
      });
    }
    
    const newProduct: Product = {
      id: uuidv4(),
      name: createRequest.name,
      description: createRequest.description,
      price: createRequest.price,
      category: createRequest.category,
      quantity: createRequest.quantity,
      inStock: createRequest.quantity > 0,
      createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    
    res.status(201).json({
      success: true,
      data: newProduct
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to create product',
      details: error.message
    });
  }
});

// PUT /api/products/:id - Update product
router.put('/products/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateRequest: UpdateProductRequest = req.body;
    
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        id
      });
    }
    
    // Update product with provided fields
    const updatedProduct: Product = {
      ...products[productIndex],
      ...updateRequest
    };
    
    // Update inStock status based on quantity if quantity is being updated
    if (updateRequest.quantity !== undefined) {
      updatedProduct.inStock = updateRequest.quantity > 0;
    }
    
    products[productIndex] = updatedProduct;
    
    res.json({
      success: true,
      data: updatedProduct
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to update product',
      details: error.message
    });
  }
});

// DELETE /api/products/:id - Delete product
router.delete('/products/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        id
      });
    }
    
    const deletedProduct = products.splice(productIndex, 1)[0];
    
    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: deletedProduct
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete product',
      details: error.message
    });
  }
});

// GET /api/products/category/:category - Get products by category
router.get('/products/category/:category', (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const categoryProducts = products.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
    
    res.json({
      success: true,
      category,
      count: categoryProducts.length,
      data: categoryProducts
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products by category',
      details: error.message
    });
  }
});

export { router as restRoutes };