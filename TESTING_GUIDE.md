# Testing Guide - Express.js API

## Server Status
✅ Server berjalan di: `http://localhost:3000`  
✅ Database MySQL terhubung  
✅ JWT Secret sudah dikonfigurasi  

## Quick Test
```bash
# Test server connection
curl http://localhost:3000/api/test
```

## Endpoint Testing

### 1. Test Server Connection
```
GET http://localhost:3000/api/test
```
**Expected Response:**
```json
{
  "message": "API is working!"
}
```

### 2. Register User
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "fullname": "John Doe",
  "username": "johndoe",
  "password": "password123",
  "email": "john.doe@example.com"
}
```
**Expected Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "fullname": "John Doe",
    "username": "johndoe",
    "email": "john.doe@example.com",
    "isVerified": true
  }
}
```

### 3. Login User
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123"
}
```
**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "fullname": "John Doe",
    "username": "johndoe",
    "email": "john.doe@example.com"
  }
}
```

### 4. Get Users (Protected Route)
```
GET http://localhost:3000/api/users
Authorization: Bearer YOUR_TOKEN_HERE
```
**Expected Response:**
```json
[
  {
    "id": 1,
    "fullname": "John Doe",
    "username": "johndoe",
    "email": "john.doe@example.com",
    "isVerified": true,
    "verificationToken": null,
    "image": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 5. Get Users with Query Params
```
GET http://localhost:3000/api/users?filter=fullname:John&sort=fullname:asc&search=John
Authorization: Bearer YOUR_TOKEN_HERE
```

### 6. Upload Image (Protected Route)
```
POST http://localhost:3000/api/upload
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data

Form Data:
- image: [file]
```
**Expected Response:**
```json
{
  "message": "Image uploaded successfully",
  "filename": "1234567890-image.jpg"
}
```

## Postman Collection

### Import Collection
1. Buka Postman
2. Import → pilih `postman_collection.json`
3. Import → pilih `postman_environment.json`
4. Pilih environment "Express.js API Environment"

### Testing Flow
1. **Register User** → dapat response user data
2. **Login User** → dapat token (auto-save)
3. **Get Users** → test protected route
4. **Upload Image** → test file upload
5. **Query Params** → test filter, sort, search

## Troubleshooting

### Error 401 Unauthorized
- Pastikan token valid
- Pastikan header Authorization: Bearer TOKEN
- Token expired? Login ulang

### Error 403 Forbidden
- User belum verified (untuk testing, semua user auto-verified)

### Error 500 Internal Server Error
- Cek database connection
- Cek JWT_SECRET di .env
- Cek log server

### Database Connection Error
- Pastikan MySQL XAMPP running
- Cek konfigurasi di .env
- Pastikan database `db_tugasbe3` sudah dibuat

## Environment Variables
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=db_tugasbe3
DB_PORT=3306

# JWT
JWT_SECRET=mysecretkey123456789abcdefghijklmnopqrstuvwxyz

# Email (untuk testing, tidak digunakan)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Test Data
```json
{
  "users": [
    {
      "fullname": "John Doe",
      "username": "johndoe",
      "password": "password123",
      "email": "john.doe@example.com"
    },
    {
      "fullname": "Jane Smith",
      "username": "janesmith",
      "password": "password123",
      "email": "jane.smith@example.com"
    }
  ]
}
``` 