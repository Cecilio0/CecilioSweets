export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  imageUrl?: string;
  authorId: string;
  authorName: string;
  averageRating: number;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
}
