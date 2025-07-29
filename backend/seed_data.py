"""
Script to seed the database with mock data for development.
Run this script to populate your database with sample users, recipes, and comments.
"""

from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.database import engine, get_db
from app.models import Base, User, Recipe, Comment, Rating, CommentVote
import random
from datetime import datetime, timedelta

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Sample data
SAMPLE_USERS = [
    {
        "username": "chef_maria",
        "email": "maria@example.com",
        "full_name": "Maria Rodriguez",
        "password": "password123"
    },
    {
        "username": "baker_john",
        "email": "john@example.com", 
        "full_name": "John Smith",
        "password": "password123"
    },
    {
        "username": "dessert_queen",
        "email": "sarah@example.com",
        "full_name": "Sarah Johnson",
        "password": "password123"
    },
    {
        "username": "pastry_chef",
        "email": "pierre@example.com",
        "full_name": "Pierre Dubois",
        "password": "password123"
    },
    {
        "username": "sweet_tooth",
        "email": "emily@example.com",
        "full_name": "Emily Chen",
        "password": "password123"
    }
]

SAMPLE_RECIPES = [
    {
        "title": "Classic Chocolate Chip Cookies",
        "description": "Soft and chewy chocolate chip cookies that are perfect for any occasion.",
        "ingredients": """- 2 1/4 cups all-purpose flour
- 1 tsp baking soda
- 1 tsp salt
- 1 cup butter, softened
- 3/4 cup granulated sugar
- 3/4 cup brown sugar
- 2 large eggs
- 2 tsp vanilla extract
- 2 cups chocolate chips""",
        "instructions": """1. Preheat oven to 375°F (190°C).
2. Mix flour, baking soda, and salt in a bowl.
3. Cream butter and sugars until fluffy.
4. Beat in eggs and vanilla.
5. Gradually mix in flour mixture.
6. Stir in chocolate chips.
7. Drop rounded tablespoons onto ungreased baking sheets.
8. Bake 9-11 minutes until golden brown.
9. Cool on baking sheet for 2 minutes before removing.""",
        "prep_time": 15,
        "cook_time": 10,
        "servings": 24,
        "difficulty": "easy",
        "image_url": "https://example.com/chocolate-chip-cookies.jpg"
    },
    {
        "title": "Red Velvet Cake",
        "description": "A moist and fluffy red velvet cake with cream cheese frosting.",
        "ingredients": """- 2 1/2 cups all-purpose flour
- 1 1/2 cups sugar
- 1 tsp baking soda
- 1 tsp salt
- 1 tsp cocoa powder
- 1 1/2 cups vegetable oil
- 1 cup buttermilk
- 2 large eggs
- 2 tbsp red food coloring
- 1 tsp vanilla extract
- 1 tsp white vinegar""",
        "instructions": """1. Preheat oven to 350°F (175°C). Grease two 9-inch round pans.
2. Whisk together flour, sugar, baking soda, salt, and cocoa.
3. In another bowl, whisk oil, buttermilk, eggs, food coloring, vanilla, and vinegar.
4. Combine wet and dry ingredients until just mixed.
5. Divide batter between prepared pans.
6. Bake 25-30 minutes until toothpick comes out clean.
7. Cool completely before frosting.""",
        "prep_time": 20,
        "cook_time": 30,
        "servings": 12,
        "difficulty": "medium",
        "image_url": "https://example.com/red-velvet-cake.jpg"
    },
    {
        "title": "Tiramisu",
        "description": "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.",
        "ingredients": """- 6 egg yolks
- 3/4 cup sugar
- 1 1/3 cups mascarpone cheese
- 1 3/4 cups heavy cream
- 2 packages ladyfinger cookies
- 1 cup strong espresso, cooled
- 3 tbsp coffee liqueur
- Unsweetened cocoa powder for dusting""",
        "instructions": """1. Whisk egg yolks and sugar until thick and pale.
2. Add mascarpone and beat until smooth.
3. Whip cream to stiff peaks and fold into mascarpone mixture.
4. Combine espresso and coffee liqueur.
5. Quickly dip each ladyfinger in coffee mixture and arrange in dish.
6. Spread half the mascarpone mixture over ladyfingers.
7. Repeat layers.
8. Refrigerate at least 4 hours or overnight.
9. Dust with cocoa before serving.""",
        "prep_time": 30,
        "cook_time": 0,
        "servings": 8,
        "difficulty": "hard",
        "image_url": "https://example.com/tiramisu.jpg"
    },
    {
        "title": "Lemon Bars",
        "description": "Tangy lemon bars with a buttery shortbread crust and powdered sugar topping.",
        "ingredients": """- 2 cups all-purpose flour
- 1/2 cup powdered sugar
- 1 cup butter, softened
- 4 large eggs
- 1 1/2 cups granulated sugar
- 1/4 cup all-purpose flour
- 1/3 cup fresh lemon juice
- 2 tbsp lemon zest
- Additional powdered sugar for dusting""",
        "instructions": """1. Preheat oven to 350°F (175°C).
2. Mix 2 cups flour, 1/2 cup powdered sugar, and butter until crumbly.
3. Press into greased 9x13 pan and bake 20 minutes.
4. Beat eggs, granulated sugar, 1/4 cup flour, lemon juice, and zest.
5. Pour over hot crust and bake 20-25 minutes more.
6. Cool completely and dust with powdered sugar before cutting.""",
        "prep_time": 15,
        "cook_time": 45,
        "servings": 16,
        "difficulty": "easy",
        "image_url": "https://example.com/lemon-bars.jpg"
    },
    {
        "title": "Chocolate Lava Cake",
        "description": "Individual chocolate cakes with a molten chocolate center.",
        "ingredients": """- 4 oz dark chocolate, chopped
- 4 tbsp butter
- 2 large eggs
- 2 large egg yolks
- 1/4 cup granulated sugar
- 2 tbsp all-purpose flour
- Butter and cocoa powder for ramekins
- Vanilla ice cream for serving""",
        "instructions": """1. Preheat oven to 425°F (220°C).
2. Butter and dust 4 ramekins with cocoa powder.
3. Melt chocolate and butter in double boiler.
4. Whisk eggs, egg yolks, and sugar until thick.
5. Fold in chocolate mixture and flour.
6. Divide among ramekins and bake 12-14 minutes.
7. Let stand 1 minute, then invert onto plates.
8. Serve immediately with ice cream.""",
        "prep_time": 20,
        "cook_time": 14,
        "servings": 4,
        "difficulty": "medium",
        "image_url": "https://example.com/chocolate-lava-cake.jpg"
    },
    {
        "title": "Strawberry Cheesecake",
        "description": "Creamy New York style cheesecake topped with fresh strawberries.",
        "ingredients": """- 1 1/2 cups graham cracker crumbs
- 1/3 cup melted butter
- 1/4 cup sugar
- 4 packages (8 oz each) cream cheese, softened
- 1 cup sugar
- 4 large eggs
- 1 tsp vanilla extract
- 2 cups fresh strawberries, sliced
- 1/4 cup strawberry jam""",
        "instructions": """1. Preheat oven to 350°F (175°C).
2. Mix crumbs, melted butter, and 1/4 cup sugar. Press into springform pan.
3. Beat cream cheese until fluffy. Add 1 cup sugar, then eggs one at a time.
4. Add vanilla and pour over crust.
5. Bake 45-50 minutes until center is almost set.
6. Cool completely, then refrigerate 4 hours.
7. Top with strawberries mixed with jam before serving.""",
        "prep_time": 25,
        "cook_time": 50,
        "servings": 12,
        "difficulty": "medium",
        "image_url": "https://example.com/strawberry-cheesecake.jpg"
    }
]

SAMPLE_COMMENTS = [
    "This recipe is absolutely amazing! My family loved it.",
    "Perfect for beginners. Easy to follow instructions.",
    "The texture came out exactly as described. Will make again!",
    "I substituted some ingredients and it still turned out great.",
    "This is now my go-to recipe for this dessert.",
    "The cooking time was perfect. Thanks for sharing!",
    "Beautiful presentation and delicious taste.",
    "My kids couldn't stop eating these!",
    "Great recipe, but I reduced the sugar a bit.",
    "This brought back childhood memories. Love it!",
    "Professional quality results at home.",
    "Clear instructions made this so easy to follow.",
    "The flavor combination is incredible.",
    "This recipe never fails to impress guests.",
    "I've made this multiple times now. Always perfect!"
]

def create_sample_data():
    """Create and insert sample data into the database."""
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Get database session
    db = next(get_db())
    
    try:
        # Check if data already exists
        existing_users = db.query(User).count()
        if existing_users > 0:
            print(f"Database already contains {existing_users} users. Skipping data creation.")
            return
        
        print("Creating sample users...")
        # Create users
        users = []
        for user_data in SAMPLE_USERS:
            user = User(
                username=user_data["username"],
                email=user_data["email"],
                full_name=user_data["full_name"],
                hashed_password=hash_password(user_data["password"]),
                is_active=True
            )
            db.add(user)
            users.append(user)
        
        db.commit()
        print(f"Created {len(users)} users")
        
        print("Creating sample recipes...")
        # Create recipes
        recipes = []
        for i, recipe_data in enumerate(SAMPLE_RECIPES):
            recipe = Recipe(
                title=recipe_data["title"],
                description=recipe_data["description"],
                ingredients=recipe_data["ingredients"],
                instructions=recipe_data["instructions"],
                prep_time=recipe_data["prep_time"],
                cook_time=recipe_data["cook_time"],
                servings=recipe_data["servings"],
                difficulty=recipe_data["difficulty"],
                image_url=recipe_data["image_url"],
                author_id=users[i % len(users)].id,
                is_published=True
            )
            db.add(recipe)
            recipes.append(recipe)
        
        db.commit()
        print(f"Created {len(recipes)} recipes")
        
        print("Creating sample comments...")
        # Create comments
        comments_created = 0
        for recipe in recipes:
            # Create 2-4 comments per recipe
            num_comments = random.randint(2, 4)
            for _ in range(num_comments):
                comment = Comment(
                    content=random.choice(SAMPLE_COMMENTS),
                    recipe_id=recipe.id,
                    author_id=random.choice(users).id,
                    is_active=True
                )
                db.add(comment)
                comments_created += 1
        
        db.commit()
        print(f"Created {comments_created} comments")
        
        print("Creating sample ratings...")
        # Create ratings
        ratings_created = 0
        for recipe in recipes:
            # Create 3-8 ratings per recipe
            num_ratings = random.randint(3, 8)
            used_users = set()
            
            for _ in range(num_ratings):
                # Ensure each user can only rate a recipe once
                available_users = [u for u in users if u.id not in used_users]
                if not available_users:
                    break
                
                user = random.choice(available_users)
                used_users.add(user.id)
                
                # Generate ratings with bias towards higher scores
                rating_value = round(random.uniform(3.0, 5.0), 1)
                
                rating = Rating(
                    rating=rating_value,
                    recipe_id=recipe.id,
                    user_id=user.id
                )
                db.add(rating)
                ratings_created += 1
        
        db.commit()
        print(f"Created {ratings_created} ratings")
        
        print("Creating sample comment votes...")
        # Create comment votes
        all_comments = db.query(Comment).all()
        votes_created = 0
        
        for comment in all_comments:
            # Create 1-5 votes per comment
            num_votes = random.randint(1, 5)
            used_users = set()
            
            for _ in range(num_votes):
                available_users = [u for u in users if u.id not in used_users]
                if not available_users:
                    break
                
                user = random.choice(available_users)
                used_users.add(user.id)
                
                # 70% chance of upvote, 30% chance of downvote
                vote_type = "up" if random.random() < 0.7 else "down"
                
                vote = CommentVote(
                    vote_type=vote_type,
                    comment_id=comment.id,
                    user_id=user.id
                )
                db.add(vote)
                votes_created += 1
        
        db.commit()
        print(f"Created {votes_created} comment votes")
        
        print("\n✅ Sample data created successfully!")
        print("\nTest user credentials (all passwords: 'password123'):")
        for user_data in SAMPLE_USERS:
            print(f"  Username: {user_data['username']} | Email: {user_data['email']}")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error creating sample data: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("🍰 CecilioSweets Database Seeder")
    print("================================")
    create_sample_data()
