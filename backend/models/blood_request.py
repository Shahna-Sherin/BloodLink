from pydantic import BaseModel

class BloodRequestModel(BaseModel):
    patient_name: str
    contact: str
    hospital: str
    location: str
    blood_group: str
    units_needed: int = 1
    urgency: str = "Normal"
    notes: str = ""