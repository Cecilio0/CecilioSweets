import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from './models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8000/api/comments';
  private recipeApiUrl = 'http://localhost:8000/api/recipes';

  constructor(private http: HttpClient) {}

  // Get comments for a specific recipe
  getRecipeComments(recipeId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/recipe/${recipeId}`);
  }

  // Get a specific comment by ID
  getComment(commentId: string): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiUrl}/${commentId}`);
  }

  // Create a new comment
  createComment(recipeId: string, content: string, parentId?: string): Observable<Comment> {
    const commentData: any = {
      recipe_id: parseInt(recipeId),
      content: content
    };

    if (parentId) {
      commentData.parent_id = parseInt(parentId);
    }

    return this.http.post<Comment>(`${this.apiUrl}`, commentData);
  }

  // Update an existing comment
  updateComment(commentId: string, content: string): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${commentId}`, { content });
  }

  // Delete a comment
  deleteComment(commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${commentId}`);
  }

  // Vote on a comment (upvote or downvote)
  voteComment(commentId: string, voteType: 'up' | 'down'): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${commentId}/vote`, { vote_type: voteType });
  }

  // Remove vote from a comment
  removeCommentVote(commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${commentId}/vote`);
  }

  // Get replies to a specific comment
  getCommentReplies(commentId: string, page: number = 1, limit: number = 10): Observable<{comments: Comment[], total: number}> {
    let params = new HttpParams()
      .set('skip', ((page - 1) * limit).toString())
      .set('limit', limit.toString());

    return this.http.get<{comments: Comment[], total: number}>(`${this.apiUrl}/${commentId}/replies`, { params });
  }

  // Get user's comments
  getUserComments(userId: string, page: number = 1, limit: number = 20): Observable<{comments: Comment[], total: number}> {
    let params = new HttpParams()
      .set('skip', ((page - 1) * limit).toString())
      .set('limit', limit.toString());

    return this.http.get<{comments: Comment[], total: number}>(`/api/users/${userId}/comments`, { params });
  }

  // Report a comment
  reportComment(commentId: string, reason: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${commentId}/report`, { reason });
  }

  // Mark comment as helpful (for moderation purposes)
  markCommentHelpful(commentId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${commentId}/helpful`, {});
  }

  // Get comment statistics
  getCommentStats(commentId: string): Observable<{upvotes: number, downvotes: number, replies: number}> {
    return this.http.get<{upvotes: number, downvotes: number, replies: number}>(`${this.apiUrl}/${commentId}/stats`);
  }

  // Search comments by content
  searchComments(query: string, page: number = 1, limit: number = 20): Observable<{comments: Comment[], total: number}> {
    let params = new HttpParams()
      .set('q', query)
      .set('skip', ((page - 1) * limit).toString())
      .set('limit', limit.toString());

    return this.http.get<{comments: Comment[], total: number}>(`${this.apiUrl}/search`, { params });
  }

  // Get recent comments (for activity feeds)
  getRecentComments(limit: number = 10): Observable<Comment[]> {
    let params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Comment[]>(`${this.apiUrl}/recent`, { params });
  }

  // Bulk operations
  bulkDeleteComments(commentIds: string[]): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/bulk`, { body: { comment_ids: commentIds } });
  }

  // Toggle comment visibility (for moderation)
  toggleCommentVisibility(commentId: string): Observable<Comment> {
    return this.http.patch<Comment>(`${this.apiUrl}/${commentId}/toggle-visibility`, {});
  }
}
