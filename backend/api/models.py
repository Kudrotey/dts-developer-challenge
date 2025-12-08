from pydantic import BaseModel, ConfigDict, field_validator
from datetime import datetime
from typing import Optional

class Task(BaseModel):
    id: Optional[int] = None
    title: str
    description: Optional[str] = None
    status: str
    due_date_time: datetime

    model_config = ConfigDict({"from_attributes": True})

    @field_validator("description", mode="before")
    @classmethod
    def empty_string_to_none(cls, value):
        if isinstance(value, str) and value.strip() == "":
            return None
        return value
