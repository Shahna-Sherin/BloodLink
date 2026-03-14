from fastapi import APIRouter
from models.blood_request import BloodRequestModel
from db.mongo import requests_collection
from datetime import datetime

router = APIRouter(prefix="/requests", tags=["Blood Requests"])

@router.post("/create")
async def create_request(request: BloodRequestModel):
    request_dict = request.dict()
    request_dict["created_at"] = datetime.utcnow()
    request_dict["status"] = "pending"
    result = await requests_collection.insert_one(request_dict)
    return {"message": "Blood request submitted successfully", "id": str(result.inserted_id)}

@router.get("/")
async def get_requests():
    requests = []
    async for req in requests_collection.find({}, {"_id": 0}):
        requests.append(req)
    return requests