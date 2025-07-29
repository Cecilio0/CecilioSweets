import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from './models/recipe';
import { Comment } from './models/comment';
import { Rating } from './models/rating';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:8000/api/recipes';

  constructor(private http: HttpClient) {}

  getRecipes(page: number = 1, limit: number = 12, search?: string): Observable<{recipes: Recipe[], total: number}> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<{recipes: Recipe[], total: number}>(this.apiUrl, { params });
  }

  getRecipe(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }

  createRecipe(recipe: Partial<Recipe>): Observable<Recipe> {
    return this.http.post<Recipe>(this.apiUrl, recipe);
  }

  updateRecipe(id: string, recipe: Partial<Recipe>): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}/${id}`, recipe);
  }

  deleteRecipe(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getRecipeComments(recipeId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/${recipeId}/comments`);
  }

  addComment(recipeId: string, content: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/${recipeId}/comments`, { content });
  }

  updateComment(commentId: string, content: string): Observable<Comment> {
    return this.http.put<Comment>(`/api/comments/${commentId}`, { content });
  }

  deleteComment(commentId: string): Observable<void> {
    return this.http.delete<void>(`/api/comments/${commentId}`);
  }

  voteComment(commentId: string, vote: 'up' | 'down'): Observable<void> {
    return this.http.post<void>(`/api/comments/${commentId}/vote`, { vote });
  }

  removeCommentVote(commentId: string): Observable<void> {
    return this.http.delete<void>(`/api/comments/${commentId}/vote`);
  }

  rateRecipe(recipeId: string, rating: number): Observable<Rating> {
    return this.http.post<Rating>(`${this.apiUrl}/${recipeId}/ratings`, { rating });
  }

  getRecipeRatings(recipeId: string): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}/${recipeId}/ratings`);
  }
}
