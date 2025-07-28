from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
import uvicorn

from app.database import get_db, engine
from app.models import Base
from app.routers import auth, recipes, comments, ratings

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CecilioSweets API",
    description="A dessert recipe platform API with user authentication, ratings, and comments",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(recipes.router, prefix="/api/recipes", tags=["recipes"])
app.include_router(comments.router, prefix="/api/comments", tags=["comments"])
app.include_router(ratings.router, prefix="/api/ratings", tags=["ratings"])

@app.get("/")
async def root():
    return {"message": "Welcome to CecilioSweets API"}

@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    return {"status": "healthy", "database": "connected"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)