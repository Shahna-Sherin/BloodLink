from db.mongo import donors_collection
from ml_model.predictor import predict_donor_score
from datetime import datetime

async def find_emergency_donors(blood_group: str, location: str, limit: int = 10):
    compatible_groups = get_compatible_groups(blood_group)

    donors = []
    async for donor in donors_collection.find(
        {"blood_group": {"$in": compatible_groups}, "availability": True},
        {"_id": 0}
    ):
        donor["ml_score"] = predict_donor_score(
            age=donor.get("age", 25),
            weight=donor.get("weight", 60),
            months_since_last_donation=donor.get("months_since_last_donation", 0),
            total_donations=donor.get("total_donations", 0),
            availability=True
        )
        if location.lower() in donor.get("current_locality", "").lower() or \
           location.lower() in donor.get("place_of_residence", "").lower():
            donor["ml_score"] = min(donor["ml_score"] + 0.2, 1.0)
            donor["location_match"] = True
        else:
            donor["location_match"] = False
        donors.append(donor)

    donors.sort(key=lambda x: x["ml_score"], reverse=True)
    return donors[:limit]

def get_compatible_groups(blood_group: str) -> list:
    compatibility = {
        "A+":  ["A+", "A-", "O+", "O-"],
        "A-":  ["A-", "O-"],
        "B+":  ["B+", "B-", "O+", "O-"],
        "B-":  ["B-", "O-"],
        "O+":  ["O+", "O-"],
        "O-":  ["O-"],
        "AB+": ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
        "AB-": ["A-", "B-", "O-", "AB-"],
    }
    return compatibility.get(blood_group, [blood_group])