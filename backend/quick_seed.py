"""
Quick script to add basic test data to the database.
Run with: python quick_seed.py
"""

from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.database import engine, get_db
from app.models import Base, User, Recipe, Comment, Rating

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def create_basic_data():
    """Create basic test data quickly."""
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Get database session
    db = next(get_db())
    
    try:
        # Check if data exists
        if db.query(User).count() > 0:
            print("Data already exists. Skipping creation.")
            return
        
        print("Creating test users...")
        # Create test users
        users = [
            User(
                username="testuser",
                email="test@example.com",
                full_name="Test User",
                hashed_password=hash_password("password"),
                is_active=True
            ),
            User(
                username="chef",
                email="chef@example.com", 
                full_name="Master Chef",
                hashed_password=hash_password("password"),
                is_active=True
            )
        ]
        
        for user in users:
            db.add(user)
        db.commit()
        
        print("Creating test recipes...")
        # Create test recipes
        recipes = [
            Recipe(
                title="Quick Chocolate Cookies",
                description="Simple and delicious chocolate cookies",
                ingredients="Flour, sugar, chocolate chips, butter, eggs",
                instructions="1. Mix ingredients\n2. Bake at 350F for 10 minutes",
                prep_time=10,
                cook_time=10,
                servings=12,
                difficulty="easy",
                author_id=users[0].id,
                is_published=True
            ),
            Recipe(
                title="Simple Vanilla Cake",
                description="Basic vanilla cake recipe",
                ingredients="Flour, sugar, vanilla, butter, eggs, milk",
                instructions="1. Mix dry ingredients\n2. Add wet ingredients\n3. Bake at 350F for 25 minutes",
                prep_time=15,
                cook_time=25,
                servings=8,
                difficulty="easy",
                author_id=users[1].id,
                is_published=True
            )
        ]
        
        for recipe in recipes:
            db.add(recipe)
        db.commit()
        
        print("Creating test comments...")
        # Create test comments
        comments = [
            Comment(
                content="This recipe is amazing! So easy to follow.",
                recipe_id=recipes[0].id,
                author_id=users[1].id,
                is_active=True
            ),
            Comment(
                content="Perfect for beginners. My kids loved it!",
                recipe_id=recipes[0].id,
                author_id=users[0].id,
                is_active=True
            ),
            Comment(
                content="Great cake recipe. Will definitely make again.",
                recipe_id=recipes[1].id,
                author_id=users[0].id,
                is_active=True
            )
        ]
        
        for comment in comments:
            db.add(comment)
        db.commit()
        
        print("Creating test ratings...")
        # Create test ratings
        ratings = [
            Rating(rating=4.5, recipe_id=recipes[0].id, user_id=users[1].id),
            Rating(rating=5.0, recipe_id=recipes[1].id, user_id=users[0].id),
        ]
        
        for rating in ratings:
            db.add(rating)
        db.commit()
        
        print("\n✅ Basic test data created successfully!")
        print("\nTest login credentials:")
        print("Username: testuser | Password: password")
        print("Username: chef | Password: password")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    create_basic_data()
