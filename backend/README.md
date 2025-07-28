# Backend - CecilioSweets API

The backend API for CecilioSweets dessert recipe platform, built with FastAPI and PostgreSQL.

## Overview

This is the server-side application that provides the REST API for the CecilioSweets platform. It handles user authentication, recipe management, comments, ratings, and the voting system for comments.

## Technology Stack

- **Framework**: FastAPI 0.104.1
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT (JSON Web Tokens) with passlib for password hashing
- **Validation**: Pydantic for request/response validation
- **Migration**: Alembic for database migrations
- **Server**: Uvicorn ASGI server

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Recipe Management**: CRUD operations for dessert recipes
- **Rating System**: Users can rate recipes (1-5 stars)
- **Comment System**: Users can comment on recipes with nested replies
- **Vote System**: Thumbs up/down voting on comments
- **Search**: Search recipes by title
- **Authorization**: Role-based access control for recipe and comment management

## Project Structure

```
backend/
├── app/
│   ├── routers/           # API route handlers
│   │   ├── auth.py       # Authentication endpoints
│   │   ├── recipes.py    # Recipe CRUD endpoints
│   │   ├── comments.py   # Comment management endpoints
│   │   └── ratings.py    # Rating system endpoints
│   ├── models.py         # SQLAlchemy database models
│   ├── schemas.py        # Pydantic request/response schemas
│   ├── database.py       # Database connection and session management
│   ├── auth.py           # Authentication utilities and dependencies
│   └── __init__.py
├── main.py               # FastAPI application entry point
├── requirements.txt      # Python dependencies
├── .env.example          # Environment variables template
└── README.md             # This file
```

## Database Models

### User
- id, username, email, hashed_password
- full_name, is_active, created_at, updated_at
- Relationships: recipes, comments, ratings, votes

### Recipe
- id, title, description, ingredients, instructions
- prep_time, cook_time, servings, difficulty, image_url
- author_id, is_published, created_at, updated_at
- Relationships: author, comments, ratings

### Comment
- id, content, recipe_id, author_id, parent_id
- is_active, created_at, updated_at
- Relationships: recipe, author, parent, votes

### Rating
- id, rating (1.0-5.0), recipe_id, user_id
- created_at, updated_at
- Relationships: recipe, user

### CommentVote
- id, vote_type ('up'/'down'), comment_id, user_id
- created_at
- Relationships: comment, user

## Getting Started

### Prerequisites
- Python 3.8 or higher
- PostgreSQL 12 or higher
- pip or pipenv

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up PostgreSQL database:
```bash
# Create database
createdb ceciliosweets

# Or using psql
psql -c "CREATE DATABASE ceciliosweets;"
```

5. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials and secret key
```

6. Run database migrations (optional - tables are created automatically):
```bash
# Initialize Alembic (if you want to use migrations)
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

7. Start the development server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/ceciliosweets
SECRET_KEY=your-super-secret-key-here-change-this-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login (returns JWT token)
- `GET /api/auth/me` - Get current user profile

### Recipes
- `GET /api/recipes/` - Get all recipes (with pagination and search)
- `POST /api/recipes/` - Create new recipe (requires authentication)
- `GET /api/recipes/{recipe_id}` - Get recipe by ID
- `PUT /api/recipes/{recipe_id}` - Update recipe (owner only)
- `DELETE /api/recipes/{recipe_id}` - Delete recipe (owner only)

### Comments
- `GET /api/comments/recipe/{recipe_id}` - Get comments for a recipe
- `POST /api/comments/` - Create new comment (requires authentication)
- `PUT /api/comments/{comment_id}` - Update comment (owner only)
- `DELETE /api/comments/{comment_id}` - Delete comment (owner only)
- `POST /api/comments/{comment_id}/vote` - Vote on comment (up/down)
- `DELETE /api/comments/{comment_id}/vote` - Remove vote from comment

### Ratings
- `POST /api/ratings/` - Rate a recipe (requires authentication)
- `GET /api/ratings/recipe/{recipe_id}` - Get recipe rating statistics
- `GET /api/ratings/user/{user_id}/recipe/{recipe_id}` - Get user's rating for recipe
- `DELETE /api/ratings/recipe/{recipe_id}` - Delete user's rating

## API Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Authentication

The API uses JWT Bearer tokens for authentication:

1. Register or login to get an access token
2. Include the token in the Authorization header:
   ```
   Authorization: Bearer <your-token-here>
   ```

## Database Operations

### Manual Database Setup
```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE ceciliosweets;

-- Create user (optional)
CREATE USER cecilio WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE ceciliosweets TO cecilio;
```

### Reset Database
```bash
# Drop and recreate database
dropdb ceciliosweets
createdb ceciliosweets

# Restart the application to recreate tables
uvicorn main:app --reload
```

## Testing

Run the application and test endpoints using the interactive documentation at `/docs` or use curl/Postman:

```bash
# Register a new user
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpassword",
    "full_name": "Test User"
  }'

# Login
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=testpassword"
```

## Production Deployment

### Environment Setup
- Use a strong, unique SECRET_KEY
- Set up PostgreSQL with proper security
- Use environment variables for all sensitive data
- Enable HTTPS/SSL

### Docker Deployment (Optional)
Create a `Dockerfile`:
```dockerfile
FROM python:3.9

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- SQL injection prevention with SQLAlchemy ORM
- Input validation with Pydantic
- CORS configuration for frontend integration
- User authorization for resource access

## Contributing

1. Follow PEP 8 style guidelines
2. Add type hints to all functions
3. Write docstrings for complex functions
4. Test all endpoints before submitting PRs
5. Update this README when adding new features

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check PostgreSQL is running
   - Verify DATABASE_URL in .env file
   - Ensure database exists

2. **Import Errors**
   - Activate virtual environment
   - Install requirements: `pip install -r requirements.txt`

3. **JWT Token Issues**
   - Check SECRET_KEY is set
   - Verify token hasn't expired
   - Ensure proper Authorization header format