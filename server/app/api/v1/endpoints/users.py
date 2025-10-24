from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.user import User, UserCreate, UserUpdate
from app.services.user_service import UserService
from app.dependencies import get_current_user

router = APIRouter()
user_service = UserService()


@router.get("/", response_model=List[User])
async def get_users(skip: int = 0, limit: int = 100):
    """Get all users"""
    return user_service.get_users(skip=skip, limit=limit)


@router.get("/{user_id}", response_model=User)
async def get_user(user_id: int):
    """Get a specific user by ID"""
    user = user_service.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/", response_model=User, status_code=201)
async def create_user(user: UserCreate):
    """Create a new user"""
    return user_service.create_user(user)


@router.put("/{user_id}", response_model=User)
async def update_user(user_id: int, user: UserUpdate):
    """Update an existing user"""
    updated_user = user_service.update_user(user_id, user)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user


@router.delete("/{user_id}", status_code=204)
async def delete_user(user_id: int):
    """Delete a user"""
    success = user_service.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
