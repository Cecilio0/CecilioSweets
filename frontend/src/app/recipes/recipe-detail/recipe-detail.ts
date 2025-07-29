import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../models/recipe';
import { Comment } from '../models/comment';
import { RecipeService } from '../recipe';
import { AuthService } from '../../auth/auth';
import { RatingComponent } from '../rating/rating';
import { CommentComponent } from '../comment/comment';

@Component({
  selector: 'app-recipe-detail',
  imports: [CommonModule, FormsModule, RatingComponent, CommentComponent],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.css'
})
export class RecipeDetail implements OnInit {
  recipe: Recipe | null = null;
  comments: Comment[] = [];
  loading = false;
  commentsLoading = false;
  error = '';
  newComment = '';
  userRating = 0;
  isOwner = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRecipe(id);
      this.loadComments(id);
    }
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get currentUser() {
    return this.authService.currentUser$;
  }

  loadRecipe(id: string): void {
    this.loading = true;
    this.error = '';

    this.recipeService.getRecipe(id).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
        this.loading = false;
        
        // Check if current user is the owner
        this.authService.currentUser$.subscribe(user => {
          this.isOwner = user?.id === recipe.authorId;
        });
      },
      error: () => {
        this.error = 'Failed to load recipe';
        this.loading = false;
      }
    });
  }

  loadComments(recipeId: string): void {
    this.commentsLoading = true;
    
    this.recipeService.getRecipeComments(recipeId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.commentsLoading = false;
      },
      error: () => {
        this.commentsLoading = false;
      }
    });
  }

  onRatingChange(rating: number): void {
    if (this.recipe && this.isAuthenticated) {
      this.recipeService.rateRecipe(this.recipe.id, rating).subscribe({
        next: () => {
          this.userRating = rating;
          // Reload recipe to get updated average rating
          this.loadRecipe(this.recipe!.id);
        }
      });
    }
  }

  addComment(): void {
    if (this.newComment.trim() && this.recipe && this.isAuthenticated) {
      this.recipeService.addComment(this.recipe.id, this.newComment).subscribe({
        next: (comment) => {
          this.comments.unshift(comment);
          this.newComment = '';
        }
      });
    }
  }

  onCommentDeleted(commentId: string): void {
    this.comments = this.comments.filter(c => c.id !== commentId);
  }

  onCommentUpdated(updatedComment: Comment): void {
    const index = this.comments.findIndex(c => c.id === updatedComment.id);
    if (index !== -1) {
      this.comments[index] = updatedComment;
    }
  }

  editRecipe(): void {
    if (this.recipe) {
      this.router.navigate(['/recipes/edit', this.recipe.id]);
    }
  }

  deleteRecipe(): void {
    if (this.recipe && confirm('Are you sure you want to delete this recipe?')) {
      this.recipeService.deleteRecipe(this.recipe.id).subscribe({
        next: () => {
          this.router.navigate(['/recipes']);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/recipes']);
  }

  getTotalTime(): number {
    return this.recipe ? this.recipe.prepTime + this.recipe.cookTime : 0;
  }

  getDifficultyClass(difficulty: string): string {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'difficulty-easy';
      case 'medium': return 'difficulty-medium';
      case 'hard': return 'difficulty-hard';
      default: return '';
    }
  }

  canEditComment(comment: Comment): boolean {
    if (!this.isAuthenticated) return false;
    
    let canEdit = false;
    this.authService.currentUser$.subscribe(user => {
      canEdit = user?.id === comment.userId;
    }).unsubscribe();
    
    return canEdit;
  }
}
