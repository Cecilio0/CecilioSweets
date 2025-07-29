export interface Comment {
  id: string;
  recipeId: string;
  userId: string;
  userName: string;
  content: string;
  votes: number;
  userVote?: 'up' | 'down' | null;
  createdAt: Date;
  updatedAt: Date;
}
