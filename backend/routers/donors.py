from fastapi import APIRouter
from models.donor import DonorModel
from db.mongo import donors_collection
from ml_model.predictor import rank_donors, predict_donor_score
from datetime import datetime
from pydantic import BaseModel
from services.email_service import send_donor_request_email

router = APIRouter(prefix="/donors", tags=["Donors"])

class DonationRequest(BaseModel):
    donor_name: str
    donor_email: str
    donor_contact: str
    requester_name: str
    requester_contact: str
    blood_group: str
    location: str
    message: str = ""

@router.post("/register")
async def register_donor(donor: DonorModel):
    donor_dict = donor.dict()
    donor_dict["created_at"] = datetime.utcnow()
    donor_dict["ml_score"] = predict_donor_score(
        age=donor.age,
        weight=donor.weight,
        months_since_last_donation=donor.months_since_last_donation,
        total_donations=donor.total_donations,
        availability=donor.availability
    )
    result = await donors_collection.insert_one(donor_dict)
    return {"message": "Donor registered successfully", "id": str(result.inserted_id)}

@router.get("/")
async def get_donors():
    donors = []
    async for donor in donors_collection.find({}, {"_id": 0}):
        donors.append(donor)
    return rank_donors(donors)

@router.get("/count")
async def get_donor_count():
    count = await donors_collection.count_documents({})
    return {"total": count}

@router.post("/predict")
async def predict_donors(blood_group: str = None):
    donors = []
    query = {"blood_group": blood_group} if blood_group else {}
    async for donor in donors_collection.find(query, {"_id": 0}):
        donors.append(donor)
    return rank_donors(donors)

@router.post("/request-donor")
async def request_donor(data: DonationRequest):
    success = send_donor_request_email(
        donor_name=data.donor_name,
        donor_email=data.donor_email,
        requester_name=data.requester_name,
        requester_contact=data.requester_contact,
        blood_group=data.blood_group,
        location=data.location,
        message=data.message
    )
    if success:
        return {"message": f"✅ Request sent successfully to {data.donor_name}!"}
    else:
        return {"message": "❌ Failed to send email. Please try again."}