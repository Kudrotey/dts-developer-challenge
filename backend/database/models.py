from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column
from app import db

class Task(db.Model):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[Optional[str]] = mapped_column(db.Text, nullable=True)
    status: Mapped[str] = mapped_column(nullable=False)
    due_date_time: Mapped[datetime] = mapped_column(nullable=False)
