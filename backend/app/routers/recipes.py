from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Recipe, User, Rating
from app.schemas import Recipe as RecipeSchema, RecipeCreate, RecipeUpdate
from app.auth import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[RecipeSchema])
def read_recipes(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Recipe).filter(Recipe.is_published == True)
    
    if search:
        query = query.filter(Recipe.title.contains(search))
    
    recipes = query.offset(skip).limit(limit).all()
    
    # Add average rating to each recipe
    for recipe in recipes:
        avg_rating = db.query(func.avg(Rating.rating)).filter(Rating.recipe_id == recipe.id).scalar()
        rating_count = db.query(Rating).filter(Rating.recipe_id == recipe.id).count()
        recipe.average_rating = round(avg_rating, 2) if avg_rating else None
        recipe.rating_count = rating_count
    
    return recipes

@router.post("/", response_model=RecipeSchema)
def create_recipe(
    recipe: RecipeCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    db_recipe = Recipe(**recipe.dict(), author_id=current_user.id)
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe

@router.get("/{recipe_id}", response_model=RecipeSchema)
def read_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    # Add average rating
    avg_rating = db.query(func.avg(Rating.rating)).filter(Rating.recipe_id == recipe.id).scalar()
    rating_count = db.query(Rating).filter(Rating.recipe_id == recipe.id).count()
    recipe.average_rating = round(avg_rating, 2) if avg_rating else None
    recipe.rating_count = rating_count
    
    return recipe

@router.put("/{recipe_id}", response_model=RecipeSchema)
def update_recipe(
    recipe_id: int,
    recipe_update: RecipeUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    if recipe.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    update_data = recipe_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(recipe, field, value)
    
    db.commit()
    db.refresh(recipe)
    return recipe

@router.delete("/{recipe_id}")
def delete_recipe(
    recipe_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    if recipe.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db.delete(recipe)
    db.commit()
    return {"message": "Recipe deleted successfully"}