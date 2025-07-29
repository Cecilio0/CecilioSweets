import { User } from "../../auth/models/user";

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  imageUrl?: string;
  author: User;
  author_name: string;
  average_rating: number;
  rating_count: number;
  created_at: Date;
  updated_at: Date;
}
