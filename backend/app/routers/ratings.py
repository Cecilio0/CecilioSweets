from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Rating, User, Recipe
from app.schemas import Rating as RatingSchema, RatingCreate
from app.auth import get_current_active_user

router = APIRouter()

@router.post("/", response_model=RatingSchema)
def create_rating(
    rating: RatingCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Check if recipe exists
    recipe = db.query(Recipe).filter(Recipe.id == rating.recipe_id).first()
    if recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    # Validate rating value
    if rating.rating < 1.0 or rating.rating > 5.0:
        raise HTTPException(status_code=400, detail="Rating must be between 1.0 and 5.0")
    
    # Check if user already rated this recipe
    existing_rating = db.query(Rating).filter(
        Rating.recipe_id == rating.recipe_id,
        Rating.user_id == current_user.id
    ).first()
    
    if existing_rating:
        # Update existing rating
        existing_rating.rating = rating.rating
        db.commit()
        db.refresh(existing_rating)
        return existing_rating
    else:
        # Create new rating
        db_rating = Rating(
            recipe_id=rating.recipe_id,
            user_id=current_user.id,
            rating=rating.rating
        )
        db.add(db_rating)
        db.commit()
        db.refresh(db_rating)
        return db_rating

@router.get("/recipe/{recipe_id}")
def get_recipe_ratings(recipe_id: int, db: Session = Depends(get_db)):
    # Check if recipe exists
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    # Get rating statistics
    ratings = db.query(Rating).filter(Rating.recipe_id == recipe_id).all()
    avg_rating = db.query(func.avg(Rating.rating)).filter(Rating.recipe_id == recipe_id).scalar()
    rating_count = len(ratings)
    
    # Get rating distribution
    rating_distribution = {}
    for i in range(1, 6):
        count = db.query(Rating).filter(
            Rating.recipe_id == recipe_id,
            Rating.rating >= i,
            Rating.rating < i + 1
        ).count()
        rating_distribution[str(i)] = count
    
    return {
        "average_rating": round(avg_rating, 2) if avg_rating else None,
        "rating_count": rating_count,
        "rating_distribution": rating_distribution
    }

@router.get("/user/{user_id}/recipe/{recipe_id}", response_model=RatingSchema)
def get_user_rating(
    user_id: int,
    recipe_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Users can only view their own ratings unless they're viewing a public recipe
    if user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    rating = db.query(Rating).filter(
        Rating.recipe_id == recipe_id,
        Rating.user_id == user_id
    ).first()
    
    if rating is None:
        raise HTTPException(status_code=404, detail="Rating not found")
    
    return rating

@router.delete("/recipe/{recipe_id}")
def delete_rating(
    recipe_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    rating = db.query(Rating).filter(
        Rating.recipe_id == recipe_id,
        Rating.user_id == current_user.id
    ).first()
    
    if rating is None:
        raise HTTPException(status_code=404, detail="Rating not found")
    
    db.delete(rating)
    db.commit()
    return {"message": "Rating deleted successfully"}