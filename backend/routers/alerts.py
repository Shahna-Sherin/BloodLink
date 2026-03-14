from fastapi import APIRouter
from services.emergency import find_emergency_donors
from services.graphrag import get_compatible_donors_graph, get_donation_path, build_blood_graph
from db.mongo import requests_collection
from datetime import datetime

router = APIRouter(prefix="/alerts", tags=["Emergency Alerts"])

@router.post("/emergency")
async def emergency_alert(blood_group: str, location: str, units_needed: int = 1):
    donors = await find_emergency_donors(blood_group, location)
    await requests_collection.insert_one({
        "type": "emergency_alert",
        "blood_group": blood_group,
        "location": location,
        "units_needed": units_needed,
        "donors_notified": len(donors),
        "created_at": datetime.utcnow(),
        "status": "active"
    })
    return {
        "message": f"Emergency alert sent! {len(donors)} donors found.",
        "blood_group": blood_group,
        "location": location,
        "top_donors": donors[:5],
        "total_found": len(donors)
    }

@router.get("/compatible/{blood_group}")
async def get_compatible_donors(blood_group: str, location: str = ""):
    donors = await find_emergency_donors(blood_group, location)
    return {
        "blood_group": blood_group,
        "compatible_donors": donors,
        "total": len(donors)
    }

@router.get("/graph/compatible/{blood_group}")
def graph_compatible(blood_group: str):
    compatible = get_compatible_donors_graph(blood_group)
    return {
        "blood_group": blood_group,
        "compatible_donor_types": compatible
    }

@router.get("/graph/path")
def donation_path(donor_type: str, recipient_type: str):
    return get_donation_path(donor_type, recipient_type)

@router.post("/graph/build")
def build_graph():
    build_blood_graph()
    return {"message": "Blood compatibility graph built in Neo4j!"}