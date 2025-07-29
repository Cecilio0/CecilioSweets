"""
Database management script for CecilioSweets
Usage: python db_manager.py [command]

Commands:
  create_tables - Create all database tables
  seed_full     - Add comprehensive sample data
  seed_basic    - Add basic test data
  clear_data    - Clear all data from tables
  reset         - Drop and recreate all tables with sample data
  status        - Show database status
"""

import sys
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.database import engine, get_db
from app.models import Base, User, Recipe, Comment, Rating, CommentVote

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def create_tables():
    """Create all database tables."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")

def clear_data():
    """Clear all data from tables."""
    db = next(get_db())
    try:
        print("Clearing all data...")
        db.query(CommentVote).delete()
        db.query(Rating).delete()
        db.query(Comment).delete()
        db.query(Recipe).delete()
        db.query(User).delete()
        db.commit()
        print("✅ All data cleared!")
    except Exception as e:
        db.rollback()
        print(f"❌ Error clearing data: {e}")
    finally:
        db.close()

def reset_database():
    """Drop and recreate all tables."""
    print("Resetting database...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("✅ Database reset complete!")

def show_status():
    """Show current database status."""
    db = next(get_db())
    try:
        user_count = db.query(User).count()
        recipe_count = db.query(Recipe).count()
        comment_count = db.query(Comment).count()
        rating_count = db.query(Rating).count()
        vote_count = db.query(CommentVote).count()
        
        print("\n📊 Database Status:")
        print(f"Users: {user_count}")
        print(f"Recipes: {recipe_count}")
        print(f"Comments: {comment_count}")
        print(f"Ratings: {rating_count}")
        print(f"Comment Votes: {vote_count}")
        
        if user_count > 0:
            print("\nSample users:")
            users = db.query(User).limit(5).all()
            for user in users:
                print(f"  - {user.username} ({user.email})")
                
    except Exception as e:
        print(f"❌ Error checking status: {e}")
    finally:
        db.close()

def seed_basic():
    """Add basic test data."""
    db = next(get_db())
    try:
        if db.query(User).count() > 0:
            print("Data already exists. Use 'clear_data' first if you want to reset.")
            return
            
        print("Adding basic test data...")
        
        # Create users
        users = [
            User(username="testuser", email="test@example.com", full_name="Test User", 
                 hashed_password=hash_password("password"), is_active=True),
            User(username="chef", email="chef@example.com", full_name="Master Chef",
                 hashed_password=hash_password("password"), is_active=True)
        ]
        for user in users:
            db.add(user)
        db.commit()
        
        # Create recipes
        recipes = [
            Recipe(title="Quick Cookies", description="Simple cookies",
                  ingredients="Flour, sugar, butter", instructions="Mix and bake",
                  prep_time=10, cook_time=10, servings=12, difficulty="easy",
                  author_id=users[0].id, is_published=True),
            Recipe(title="Vanilla Cake", description="Basic cake",
                  ingredients="Flour, sugar, vanilla", instructions="Mix and bake",
                  prep_time=15, cook_time=25, servings=8, difficulty="easy",
                  author_id=users[1].id, is_published=True)
        ]
        for recipe in recipes:
            db.add(recipe)
        db.commit()
        
        # Create comments
        comments = [
            Comment(content="Great recipe!", recipe_id=recipes[0].id, 
                   author_id=users[1].id, is_active=True),
            Comment(content="Easy to follow", recipe_id=recipes[1].id,
                   author_id=users[0].id, is_active=True)
        ]
        for comment in comments:
            db.add(comment)
        db.commit()
        
        print("✅ Basic test data added!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
    finally:
        db.close()

def main():
    if len(sys.argv) != 2:
        print(__doc__)
        return
    
    command = sys.argv[1]
    
    if command == "create_tables":
        create_tables()
    elif command == "seed_basic":
        create_tables()
        seed_basic()
    elif command == "seed_full":
        create_tables()
        exec(open("seed_data.py").read())
    elif command == "clear_data":
        clear_data()
    elif command == "reset":
        reset_database()
    elif command == "status":
        show_status()
    else:
        print(f"Unknown command: {command}")
        print(__doc__)

if __name__ == "__main__":
    main()
