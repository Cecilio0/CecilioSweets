export interface Rating {
  id: string;
  recipeId: string;
  userId: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}
