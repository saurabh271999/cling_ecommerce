# API Routes Documentation

**Base URL:** `http://localhost:8000/api`

---

## 🔐 Authentication Routes

### 1. User Signup
**Endpoint:** `POST /api/auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User created successfully. OTP sent to your email.",
  "data": {
    "userId": "user_id_here",
    "email": "john@example.com"
  }
}
```

---

### 2. Verify OTP
**Endpoint:** `POST /api/auth/verify-otp`

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id_here",
      "name": "John Doe",
      "email": "john@example.com",
      "isEmailVerified": true
    }
  }
}
```

---

### 3. Resend OTP
**Endpoint:** `POST /api/auth/resend-otp`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP resent successfully to your email"
}
```

---

### 4. User Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id_here",
      "name": "John Doe",
      "email": "john@example.com",
      "isEmailVerified": true
    }
  }
}
```

---

### 5. Google OAuth - Initiate
**Endpoint:** `GET /api/auth/google`

**Description:** Redirects user to Google OAuth login page

**Usage in Frontend:**
```javascript
// Simply redirect user to this URL
window.location.href = 'http://localhost:8000/api/auth/google';

// Or with redirect URL
window.location.href = 'http://localhost:8000/api/auth/google?redirect=http://localhost:3000/dashboard';
```

**Response:** Redirects to Google OAuth page

---

### 6. Google OAuth - Callback
**Endpoint:** `GET /api/auth/google/callback`

**Description:** This is automatically handled by Google. After user authenticates, Google redirects here.

**Response:** 
- Sets `token` cookie
- Redirects to frontend URL with token: `http://localhost:3000?token=jwt_token_here`
- Or returns JSON if `Accept: application/json` header is present

---

### 7. Logout
**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```
OR token in cookie

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 8. Get Current User
**Endpoint:** `GET /api/auth/current_user`

**Headers:**
```
Authorization: Bearer <token>
```
OR token in cookie

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id_here",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://...",
      "isEmailVerified": true,
      "googleId": "google_id_or_null"
    }
  }
}
```

---

## 📁 Category Routes

### 1. Create Category
**Endpoint:** `POST /api/categories`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Electronics",
  "description": "Electronic products",
  "image": "https://example.com/image.jpg",
  "products": []
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "_id": "category_id",
    "name": "Electronics",
    "description": "Electronic products",
    "image": "https://example.com/image.jpg",
    "products": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2. Get All Categories
**Endpoint:** `GET /api/categories`

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "category_id_1",
      "name": "Electronics",
      "description": "Electronic products",
      "image": "https://example.com/image.jpg",
      "products": [...],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Category by ID
**Endpoint:** `GET /api/categories/:id`

**Example:** `GET /api/categories/507f1f77bcf86cd799439011`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "category_id",
    "name": "Electronics",
    "description": "Electronic products",
    "image": "https://example.com/image.jpg",
    "products": [...],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4. Update Category
**Endpoint:** `PUT /api/categories/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Electronics",
  "description": "Updated description",
  "image": "https://example.com/new-image.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "_id": "category_id",
    "name": "Updated Electronics",
    "description": "Updated description",
    "image": "https://example.com/new-image.jpg",
    "products": [],
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 5. Delete Category
**Endpoint:** `DELETE /api/categories/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": {
    "_id": "category_id",
    "name": "Electronics",
    ...
  }
}
```

---

## 🔑 Authentication Headers

For protected routes, include the JWT token in the Authorization header:

```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

Or the token will be automatically read from cookies if set.

---

## 📝 Frontend Integration Examples

### React/Next.js Example

```javascript
// Signup
const signup = async (name, email, password) => {
  const response = await fetch('http://localhost:8000/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  return response.json();
};

// Login
const login = async (email, password) => {
  const response = await fetch('http://localhost:8000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.data.token);
  }
  return data;
};

// Get Current User
const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:8000/api/auth/current_user', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

// Google OAuth
const googleLogin = () => {
  window.location.href = 'http://localhost:8000/api/auth/google?redirect=http://localhost:3000/dashboard';
};

// Create Category
const createCategory = async (categoryData) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:8000/api/categories', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(categoryData)
  });
  return response.json();
};
```

---

## ⚠️ Error Responses

All endpoints return error responses in this format:

```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error message (in development)"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

