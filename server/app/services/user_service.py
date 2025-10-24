from typing import List, Optional
from app.schemas.user import User, UserCreate, UserUpdate
from datetime import datetime


class UserService:
    def __init__(self):
        # This is a mock database - replace with actual DB logic
        self.users = []

    def get_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        return self.users[skip : skip + limit]

    def get_user(self, user_id: int) -> Optional[User]:
        for user in self.users:
            if user.id == user_id:
                return user
        return None

    def create_user(self, user: UserCreate) -> User:
        new_user = User(
            id=len(self.users) + 1,
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            is_active=True,
            created_at=datetime.now(),
        )
        self.users.append(new_user)
        return new_user

    def update_user(self, user_id: int, user: UserUpdate) -> Optional[User]:
        existing_user = self.get_user(user_id)
        if not existing_user:
            return None

        update_data = user.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(existing_user, field, value)

        return existing_user

    def delete_user(self, user_id: int) -> bool:
        for i, user in enumerate(self.users):
            if user.id == user_id:
                self.users.pop(i)
                return True
        return False
