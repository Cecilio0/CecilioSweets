import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Recipe } from '../models/recipe';
import { RecipeService } from '../recipe';
import { AuthService } from '../../auth/auth';
import { RatingComponent } from '../rating/rating';
import { getDefaultRecipeImage } from '../../shared/utils/assets';

@Component({
  selector: 'app-recipe-list',
  imports: [CommonModule, FormsModule, RatingComponent],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.css'
})
export class RecipeList implements OnInit {
  recipes: Recipe[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  currentPage = 1;
  totalPages = 0;
  pageSize = 12;
  total = 0;
  Math = Math;

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRecipes();
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  loadRecipes(): void {
    this.loading = true;
    this.error = '';

    this.recipeService.getRecipes(this.currentPage, this.pageSize, this.searchTerm.trim() || undefined)
      .subscribe({
        next: (response) => {
          this.recipes = response.recipes;
          this.total = response.total;
          this.totalPages = Math.ceil(this.total / this.pageSize);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load recipes';
          this.loading = false;
        }
      });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadRecipes();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadRecipes();
    }
  }

  viewRecipe(recipe: Recipe): void {
    this.router.navigate(['/recipes/detail', recipe.id]);
  }

  createRecipe(): void {
    this.router.navigate(['/recipes/create']);
  }

  getDifficultyClass(difficulty: string): string {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'difficulty-easy';
      case 'medium': return 'difficulty-medium';
      case 'hard': return 'difficulty-hard';
      default: return '';
    }
  }

  getRecipeImageUrl(recipe: Recipe): string {
    return recipe.imageUrl || getDefaultRecipeImage();
  }

  getTotalTime(recipe: Recipe): number {
    return recipe.prep_time + recipe.cook_time;
  }

  getPaginationPages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}
