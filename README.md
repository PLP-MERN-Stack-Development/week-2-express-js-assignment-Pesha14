# Express.js Product API

This project is a RESTful API built with Express.js that manages a collection of products. It demonstrates standard CRUD operations, middleware implementation, and robust error handling.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone [your-repository-url]
    cd [your-repository-name]
    ```

2.  **Install dependencies:**
    ```bash
    npm install express body-parser uuid
    ```

3.  **Create a `.env` file:**
    The API uses an authentication middleware that requires an API key. Create a file named `.env` in the root directory with the following content:
    ```
    API_KEY=your-secret-api-key
    ```
    You can replace `your-secret-api-key` with any string.

4.  **Start the server:**
    ```bash
    node server.js
    ```
    The server will start on `http://localhost:3000`.

## API Endpoints

All endpoints are prefixed with `/api`. For authenticated routes (`POST`, `PUT`, `DELETE`), you must include the `x-api-key` header with the correct API key.

### Products

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Retrieves a list of all products. Supports filtering by category (`?category=value`) and pagination (`?page=1&limit=5`). |
| `GET` | `/api/products/:id` | Retrieves a single product by its unique ID. |
| `POST`| `/api/products` | Creates a new product. **Authentication required.** |
| `PUT` | `/api/products/:id` | Updates an existing product by its ID. **Authentication required.** |
| `DELETE`| `/api/products/:id` | Deletes a product by its ID. **Authentication required.** |

### Advanced Features

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products/search?name=term` | Searches for products by name. |
| `GET` | `/api/products/stats` | Returns a count of products grouped by category. |

## Example Requests

### Get All Products
`GET http://localhost:3000/api/products?category=electronics&page=1&limit=2`

**Response:**
```json
{
    "page": 1,
    "limit": 2,
    "total": 2,
    "data": [
        {
            "id": "1",
            "name": "Laptop",
            "description": "High-performance laptop with 16GB RAM",
            "price": 1200,
            "category": "electronics",
            "inStock": true
        },
        {
            "id": "2",
            "name": "Smartphone",
            "description": "Latest model with 128GB storage",
            "price": 800,
            "category": "electronics",
            "inStock": true
        }
    ]
}