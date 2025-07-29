import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Comment } from '../models/comment';
import { AuthService } from '../../auth/auth';
import { RecipeService } from '../recipe';

@Component({
  selector: 'app-comment',
  imports: [CommonModule, FormsModule],
  templateUrl: './comment.html',
  styleUrl: './comment.css'
})
export class CommentComponent {
  @Input() comment!: Comment;
  @Input() canEdit: boolean = false;
  @Output() commentDeleted = new EventEmitter<string>();
  @Output() commentUpdated = new EventEmitter<Comment>();

  isEditing = false;
  editContent = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.editContent = this.comment.content;
  }

  get currentUser() {
    return this.authService.currentUser$;
  }

  startEdit(): void {
    this.isEditing = true;
    this.editContent = this.comment.content;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editContent = this.comment.content;
  }

  saveEdit(): void {
    if (this.editContent.trim() && this.editContent !== this.comment.content) {
      this.loading = true;
      this.recipeService.updateComment(this.comment.id, this.editContent).subscribe({
        next: (updatedComment) => {
          this.comment = updatedComment;
          this.isEditing = false;
          this.loading = false;
          this.commentUpdated.emit(updatedComment);
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.cancelEdit();
    }
  }

  deleteComment(): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.loading = true;
      this.recipeService.deleteComment(this.comment.id).subscribe({
        next: () => {
          this.commentDeleted.emit(this.comment.id);
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  vote(voteType: 'up' | 'down'): void {
    if (this.comment.userVote === voteType) {
      // Remove vote if clicking the same vote
      this.recipeService.removeCommentVote(this.comment.id).subscribe({
        next: () => {
          const voteChange = voteType === 'up' ? -1 : 1;
          this.comment.votes += voteChange;
          this.comment.userVote = null;
        }
      });
    } else {
      this.recipeService.voteComment(this.comment.id, voteType).subscribe({
        next: () => {
          let voteChange = 0;
          if (this.comment.userVote === 'up') {
            voteChange = voteType === 'down' ? -2 : 0;
          } else if (this.comment.userVote === 'down') {
            voteChange = voteType === 'up' ? 2 : 0;
          } else {
            voteChange = voteType === 'up' ? 1 : -1;
          }
          
          this.comment.votes += voteChange;
          this.comment.userVote = voteType;
        }
      });
    }
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const commentDate = new Date(date);
    const diffMs = now.getTime() - commentDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return commentDate.toLocaleDateString();
  }
}