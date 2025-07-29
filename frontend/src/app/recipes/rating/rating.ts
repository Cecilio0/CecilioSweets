import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating',
  imports: [CommonModule],
  templateUrl: './rating.html',
  styleUrl: './rating.css'
})
export class RatingComponent {
  @Input() rating: number = 0;
  @Input() readonly: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Output() ratingChange = new EventEmitter<number>();

  stars = [1, 2, 3, 4, 5];
  hoveredStar = 0;

  onStarClick(star: number): void {
    if (!this.readonly) {
      this.rating = star;
      this.ratingChange.emit(this.rating);
    }
  }

  onStarHover(star: number): void {
    if (!this.readonly) {
      this.hoveredStar = star;
    }
  }

  onMouseLeave(): void {
    this.hoveredStar = 0;
  }

  getStarClass(star: number): string {
    const baseClass = `star ${this.size}`;
    const displayRating = this.hoveredStar || this.rating;
    
    if (star <= displayRating) {
      return `${baseClass} filled`;
    } else if (star - 0.5 <= displayRating) {
      return `${baseClass} half-filled`;
    } else {
      return `${baseClass} empty`;
    }
  }
}