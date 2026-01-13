# PS Blog Backend

Backend API server for the PS Blog application built with Node.js and Express.

## Features

- RESTful API for blog management
- JWT-based authentication
- File-based data storage (JSON)
- Admin panel authentication
- Comment system
- Blog statistics
- Rate limiting and security headers

## Admin Credentials

- **Email**: prasadshaswat9265@gmail.com
- **Password**: noonecanbeatme

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   Or for production:
   ```bash
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/verify` - Verify JWT token

### Public Blog Routes
- `GET /api/blogs` - Get all published blogs (with optional filters)
- `GET /api/blogs/:id` - Get single blog by ID

### Admin Blog Routes (Requires Authentication)
- `GET /api/admin/blogs` - Get all blogs (including drafts)
- `POST /api/admin/blogs` - Create new blog
- `PUT /api/admin/blogs/:id` - Update blog
- `DELETE /api/admin/blogs/:id` - Delete blog
- `GET /api/admin/stats` - Get blog statistics

### Comments
- `POST /api/blogs/:id/comments` - Add comment to blog

### Utility
- `GET /api/health` - Health check endpoint

## Data Storage

The application uses JSON files for data storage:
- `data/blogs.json` - Blog posts
- `data/users.json` - User accounts

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Helmet security headers
- Input validation

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

## Development

- Uses nodemon for auto-restart during development
- JSON file-based storage (can be easily migrated to database)
- Comprehensive error handling
- Request logging