// server.js - Completed Express.js server

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || 'your-secret-api-key';

// --- Task 3: Middleware Implementation ---

// Custom logger middleware
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
};

// Authentication middleware
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
  }
  next();
};

// Validation middleware for new products
const validateProduct = (req, res, next) => {
  const { name, price, category } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Product name is required and must be a non-empty string.' });
  }
  if (!price || typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: 'Product price is required and must be a positive number.' });
  }
  if (!category || typeof category !== 'string' || category.trim() === '') {
    return res.status(400).json({ error: 'Product category is required and must be a non-empty string.' });
  }
  next();
};

// Global Middleware setup
app.use(logger);
app.use(bodyParser.json());

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// --- Task 1: Root route ---
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// --- Task 2: RESTful API Routes ---

// GET /api/products - List all products with filtering and pagination
app.get('/api/products', (req, res, next) => {
  try {
    let filteredProducts = products;

    // Task 5: Filtering by category
    if (req.query.category) {
      filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === req.query.category.toLowerCase());
    }

    // Task 5: Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.json({
      page,
      limit,
      total: filteredProducts.length,
      data: paginatedProducts
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id - Get a specific product by ID
app.get('/api/products/:id', (req, res, next) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      // Task 4: Custom error handling for not found resource
      const error = new Error('Product not found');
      error.status = 404;
      throw error;
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// POST /api/products - Create a new product (with auth and validation)
app.post('/api/products', authenticate, validateProduct, (req, res, next) => {
  try {
    const newProduct = {
      id: uuidv4(),
      ...req.body
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// PUT /api/products/:id - Update an existing product (with auth and validation)
app.put('/api/products/:id', authenticate, validateProduct, (req, res, next) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
      const error = new Error('Product not found');
      error.status = 404;
      throw error;
    }
    const updatedProduct = {
      ...products[productIndex],
      ...req.body
    };
    products[productIndex] = updatedProduct;
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id - Delete a product (with auth)
app.delete('/api/products/:id', authenticate, (req, res, next) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
      const error = new Error('Product not found');
      error.status = 404;
      throw error;
    }
    products.splice(productIndex, 1);
    res.status(204).send(); // 204 No Content for successful deletion
  } catch (error) {
    next(error);
  }
});

// --- Task 5: Advanced Features ---

// Search endpoint by name
app.get('/api/products/search', (req, res, next) => {
  try {
    const searchTerm = req.query.name || '';
    if (!searchTerm) {
      return res.status(400).json({ error: 'Search term is required.' });
    }
    const searchResults = products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    res.json(searchResults);
  } catch (error) {
    next(error);
  }
});

// Get product statistics
app.get('/api/products/stats', (req, res, next) => {
  try {
    const stats = {};
    products.forEach(p => {
      stats[p.category] = (stats[p.category] || 0) + 1;
    });
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// --- Task 4: Global Error Handling Middleware ---

// This middleware must be the last one added to the stack
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message = err.message || 'Something went wrong on the server.';
  res.status(status).json({
    error: {
      status,
      message
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;