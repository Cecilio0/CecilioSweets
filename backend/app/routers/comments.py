from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Comment, User, CommentVote
from app.schemas import Comment as CommentSchema, CommentCreate, CommentVoteCreate
from app.auth import get_current_active_user

router = APIRouter()

@router.get("/recipe/{recipe_id}", response_model=List[CommentSchema])
def read_recipe_comments(recipe_id: int, db: Session = Depends(get_db)):
    comments = db.query(Comment).filter(
        Comment.recipe_id == recipe_id,
        Comment.is_active == True
    ).all()
    
    # Add vote counts to each comment
    for comment in comments:
        upvotes = db.query(CommentVote).filter(
            CommentVote.comment_id == comment.id,
            CommentVote.vote_type == "up"
        ).count()
        downvotes = db.query(CommentVote).filter(
            CommentVote.comment_id == comment.id,
            CommentVote.vote_type == "down"
        ).count()
        comment.upvotes = upvotes
        comment.downvotes = downvotes
    
    return comments

@router.post("/", response_model=CommentSchema)
def create_comment(
    comment: CommentCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    db_comment = Comment(**comment.dict(), author_id=current_user.id)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.put("/{comment_id}", response_model=CommentSchema)
def update_comment(
    comment_id: int,
    content: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    if comment.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    comment.content = content
    db.commit()
    db.refresh(comment)
    return comment

@router.delete("/{comment_id}")
def delete_comment(
    comment_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    if comment.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    comment.is_active = False
    db.commit()
    return {"message": "Comment deleted successfully"}

@router.post("/{comment_id}/vote")
def vote_comment(
    comment_id: int,
    vote: CommentVoteCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Check if comment exists
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    # Check if user already voted
    existing_vote = db.query(CommentVote).filter(
        CommentVote.comment_id == comment_id,
        CommentVote.user_id == current_user.id
    ).first()
    
    if existing_vote:
        # Update existing vote
        existing_vote.vote_type = vote.vote_type
        db.commit()
        return {"message": "Vote updated successfully"}
    else:
        # Create new vote
        db_vote = CommentVote(
            comment_id=comment_id,
            user_id=current_user.id,
            vote_type=vote.vote_type
        )
        db.add(db_vote)
        db.commit()
        return {"message": "Vote added successfully"}

@router.delete("/{comment_id}/vote")
def remove_vote(
    comment_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    vote = db.query(CommentVote).filter(
        CommentVote.comment_id == comment_id,
        CommentVote.user_id == current_user.id
    ).first()
    
    if vote is None:
        raise HTTPException(status_code=404, detail="Vote not found")
    
    db.delete(vote)
    db.commit()
    return {"message": "Vote removed successfully"}