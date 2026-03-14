from pydantic import BaseModel, EmailStr
from typing import Optional

class DonorModel(BaseModel):
    name: str
    email: str
    contact: str
    place_of_residence: str
    current_locality: str
    age: int
    weight: float
    blood_group: str
    availability: bool = True
    months_since_last_donation: int = 0
    total_donations: int = 0