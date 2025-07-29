import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommentService } from './comment.service';
import { Comment } from './models/comment';

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentService]
    });
    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get recipe comments', () => {
    const mockResponse = {
      comments: [
        {
          id: '1',
          content: 'Great recipe!',
          recipeId: '1',
          userId: '1',
          userName: 'testuser',
          votes: 5,
          userVote: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      total: 1
    };

    service.getRecipeComments('1').subscribe(response => {
      expect(response.length).toBe(1);
      expect(response[0].content).toBe('Great recipe!');
    });

    const req = httpMock.expectOne('http://localhost:8000/api/recipes/1/comments?skip=0&limit=20');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create a comment', () => {
    const mockComment: Comment = {
      id: '1',
      content: 'Test comment',
      recipeId: '1',
      userId: '1',
      userName: 'testuser',
      votes: 0,
      userVote: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    service.createComment('1', 'Test comment').subscribe(comment => {
      expect(comment.content).toBe('Test comment');
    });

    const req = httpMock.expectOne('http://localhost:8000/api/comments');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      recipe_id: 1,
      content: 'Test comment'
    });
    req.flush(mockComment);
  });

  it('should vote on a comment', () => {
    service.voteComment('1', 'up').subscribe();

    const req = httpMock.expectOne('http://localhost:8000/api/comments/1/vote');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ vote_type: 'up' });
    req.flush({});
  });

  it('should delete a comment', () => {
    service.deleteComment('1').subscribe();

    const req = httpMock.expectOne('http://localhost:8000/api/comments/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should update a comment', () => {
    const mockComment: Comment = {
      id: '1',
      content: 'Updated comment',
      recipeId: '1',
      userId: '1',
      userName: 'testuser',
      votes: 0,
      userVote: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    service.updateComment('1', 'Updated comment').subscribe(comment => {
      expect(comment.content).toBe('Updated comment');
    });

    const req = httpMock.expectOne('http://localhost:8000/api/comments/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ content: 'Updated comment' });
    req.flush(mockComment);
  });
});
