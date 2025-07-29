import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from './models/recipe';
import { Rating } from './models/rating';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:8000/api/recipes';

  constructor(private http: HttpClient) {}

  getRecipes(page: number = 1, limit: number = 12, search?: string): Observable<{recipes: Recipe[], total: number, skip: number, limit: number}> {
    let params = new HttpParams()
      .set('skip', ((page - 1) * limit).toString())
      .set('limit', limit.toString());
    
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<{recipes: Recipe[], total: number, skip: number, limit: number}>(this.apiUrl, { params });
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

  // Rating related methods
  rateRecipe(recipeId: string, rating: number): Observable<Rating> {
    return this.http.post<Rating>(`${this.apiUrl}/${recipeId}/ratings`, { rating });
  }

  getRecipeRatings(recipeId: string): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}/${recipeId}/ratings`);
  }

  // Get average rating for a recipe
  getRecipeAverageRating(recipeId: string): Observable<{average: number, count: number}> {
    return this.http.get<{average: number, count: number}>(`${this.apiUrl}/${recipeId}/ratings/average`);
  }

  // Get user's rating for a specific recipe
  getUserRecipeRating(recipeId: string): Observable<Rating | null> {
    return this.http.get<Rating | null>(`${this.apiUrl}/${recipeId}/ratings/user`);
  }

  // Update user's rating for a recipe
  updateRecipeRating(recipeId: string, rating: number): Observable<Rating> {
    return this.http.put<Rating>(`${this.apiUrl}/${recipeId}/ratings`, { rating });
  }

  // Remove user's rating from a recipe
  removeRecipeRating(recipeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${recipeId}/ratings`);
  }

  // Get recipes by user
  getUserRecipes(userId: string, page: number = 1, limit: number = 12): Observable<{recipes: Recipe[], total: number}> {
    let params = new HttpParams()
      .set('skip', ((page - 1) * limit).toString())
      .set('limit', limit.toString());

    return this.http.get<{recipes: Recipe[], total: number}>(`/api/users/${userId}/recipes`, { params });
  }

  // Get featured/popular recipes
  getFeaturedRecipes(limit: number = 6): Observable<Recipe[]> {
    let params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Recipe[]>(`${this.apiUrl}/featured`, { params });
  }

  // Search recipes with advanced filters
  searchRecipes(filters: {
    search?: string;
    difficulty?: string;
    maxPrepTime?: number;
    maxCookTime?: number;
    minRating?: number;
    page?: number;
    limit?: number;
  }): Observable<{recipes: Recipe[], total: number}> {
    let params = new HttpParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'page') {
          params = params.set('skip', (((value as number) - 1) * (filters.limit || 12)).toString());
        } else {
          params = params.set(key, value.toString());
        }
      }
    });

    return this.http.get<{recipes: Recipe[], total: number}>(`${this.apiUrl}/search`, { params });
  }
}
