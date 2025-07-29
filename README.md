# CecilioSweets - Dessert Recipe Platform

A full-stack web application for sharing and discovering dessert recipes with user authentication, ratings, comments, and community interaction features.

## Features

- **User Authentication**: Secure login and registration system
- **Recipe Management**: Browse, search, and view detailed dessert recipes
- **Rating System**: Users can rate recipes on a scale (e.g., 1-5 stars)
- **Comments**: Users can leave comments on recipes
- **Comment Voting**: Thumbs up/down system for community feedback on comments
- **User Profiles**: Personalized user experience with saved recipes and activity history

## Technology Stack

### Frontend
- **Framework**: React.js with TypeScript
- **Styling**: Tailwind CSS or CSS Modules
- **State Management**: Context API or Redux Toolkit
- **HTTP Client**: Axios
- **Routing**: React Router
- **Authentication**: JWT tokens with secure storage

### Backend
- **Runtime**: Python
- **Framework**: FastAPI
- **Database**: MongoDB with Motor (async driver)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt for hashing
- **Validation**: Pydantic models
- **File Upload**: FastAPI file upload handling

### Database Schema
- **Users**: Authentication, profiles, preferences
- **Recipes**: Recipe details, ingredients, instructions, images
- **Comments**: User comments on recipes with timestamps
- **Ratings**: User ratings for recipes
- **Votes**: Thumbs up/down votes on comments

## Project Structure

```
CecilioSweets/
├── frontend/          # React.js frontend application
├── backend/           # Node.js/Express backend API
├── docs/             # Project documentation
└── README.md         # This file
```

## Getting Started

### Prerequisites
- Python (v3.8 or higher)
- Node.js (v16 or higher) for frontend
- npm or yarn
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CecilioSweets
```

2. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Configure database connection strings and JWT secrets

5. Start the development servers:
```bash
# Terminal 1 - Backend
cd backend
uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Recipes
- `GET /api/recipes` - Get all recipes with pagination
- `GET /api/recipes/:id` - Get single recipe details
- `POST /api/recipes` - Create new recipe (authenticated)
- `PUT /api/recipes/:id` - Update recipe (authenticated, owner only)
- `DELETE /api/recipes/:id` - Delete recipe (authenticated, owner only)

### Ratings
- `POST /api/recipes/:id/ratings` - Rate a recipe
- `GET /api/recipes/:id/ratings` - Get recipe ratings

### Comments
- `GET /api/recipes/:id/comments` - Get recipe comments
- `POST /api/recipes/:id/comments` - Add comment to recipe
- `PUT /api/comments/:id` - Update comment (authenticated, owner only)
- `DELETE /api/comments/:id` - Delete comment (authenticated, owner only)

### Comment Votes
- `POST /api/comments/:id/vote` - Vote on a comment (thumbs up/down)
- `DELETE /api/comments/:id/vote` - Remove vote from comment

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add JSDoc comments for complex functions

### Testing
- Unit tests for utility functions
- Integration tests for API endpoints
- Component tests for React components
- E2E tests for critical user flows

### Security
- Input validation on all endpoints
- Rate limiting for API calls
- Secure password storage with bcrypt
- JWT token expiration handling
- CORS configuration for production

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- **Developer**: Cecilio
- **Email**: [your-email@example.com]
- **Project Link**: [https://github.com/username/CecilioSweets]