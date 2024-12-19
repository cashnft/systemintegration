from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ...core.config import settings
from ...db.session import get_db
from ...models.todo import Todo
from ...schemas.todo import TodoCreate, TodoUpdate, Todo as TodoSchema
from ..dependencies import get_current_user_id

router = APIRouter()

@router.get("/", response_model=List[TodoSchema])
async def get_todos(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Retrieve todos for the current user.
    """
    todos = db.query(Todo).filter(Todo.user_id == current_user_id)\
        .offset(skip).limit(limit).all()
    return todos

@router.post("/", response_model=TodoSchema)
async def create_todo(
    todo: TodoCreate,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Create a new todo item.
    """
    db_todo = Todo(
        **todo.dict(),
        user_id=current_user_id
    )
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@router.get("/{todo_id}", response_model=TodoSchema)
async def get_todo(
    todo_id: int,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Get a specific todo by ID.
    """
    todo = db.query(Todo).filter(
        Todo.id == todo_id,
        Todo.user_id == current_user_id
    ).first()
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo

@router.put("/{todo_id}", response_model=TodoSchema)
async def update_todo(
    todo_id: int,
    todo_update: TodoUpdate,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Update a todo item.
    """
    db_todo = db.query(Todo).filter(
        Todo.id == todo_id,
        Todo.user_id == current_user_id
    ).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    update_data = todo_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_todo, field, value)
    
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@router.delete("/{todo_id}")
async def delete_todo(
    todo_id: int,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Delete a todo item.
    """
    db_todo = db.query(Todo).filter(
        Todo.id == todo_id,
        Todo.user_id == current_user_id
    ).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    db.delete(db_todo)
    db.commit()
    return {"message": "Todo deleted successfully"}

@router.delete("/")
async def delete_all_todos(
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    """
    Delete all todos for the current user.
    """
    db.query(Todo).filter(Todo.user_id == current_user_id).delete()
    db.commit()
    return {"message": "All todos deleted successfully"}