from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# Recipe schemas
class RecipeBase(BaseModel):
    title: str
    description: Optional[str] = None
    ingredients: str
    instructions: str
    prep_time: Optional[int] = None
    cook_time: Optional[int] = None
    servings: Optional[int] = None
    difficulty: Optional[str] = None
    image_url: Optional[str] = None

class RecipeCreate(RecipeBase):
    pass

class RecipeUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    ingredients: Optional[str] = None
    instructions: Optional[str] = None
    prep_time: Optional[int] = None
    cook_time: Optional[int] = None
    servings: Optional[int] = None
    difficulty: Optional[str] = None
    image_url: Optional[str] = None

class Recipe(RecipeBase):
    id: int
    author_id: int
    is_published: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    author: User
    average_rating: Optional[float] = None
    rating_count: int = 0

    class Config:
        from_attributes = True

# Comment schemas
class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    recipe_id: int
    parent_id: Optional[int] = None

class Comment(CommentBase):
    id: int
    recipe_id: int
    author_id: int
    parent_id: Optional[int] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    author: User
    upvotes: int = 0
    downvotes: int = 0

    class Config:
        from_attributes = True

# Rating schemas
class RatingBase(BaseModel):
    rating: float

class RatingCreate(RatingBase):
    recipe_id: int

class Rating(RatingBase):
    id: int
    recipe_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Comment vote schemas
class CommentVoteCreate(BaseModel):
    vote_type: str  # 'up' or 'down'

class CommentVote(BaseModel):
    id: int
    vote_type: str
    comment_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True