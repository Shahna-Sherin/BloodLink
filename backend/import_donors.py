import asyncio
import csv
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
import sys

load_dotenv()

client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
db = client[os.getenv("MONGO_DB_NAME")]
donors_collection = db["donors"]

def calculate_ml_score(weight, donations, months):
    weight = float(weight) if weight else 50
    donations = int(donations) if donations else 0
    months = int(months) if months else 0
    w_score = 1.0 if 55 <= weight <= 80 else 0.7
    d_score = min(donations * 0.1 + 0.5, 1.0)
    r_score = max(1.0 - months * 0.02, 0.3)
    return round((w_score * 0.3 + d_score * 0.4 + r_score * 0.3), 2)

async def import_donors():
    csv_path = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'src', 'api', 'blood_donor.csv')
    
    if not os.path.exists(csv_path):
        print(f"CSV not found at {csv_path}")
        sys.exit(1)

    # Clear existing donors
    deleted = await donors_collection.delete_many({})
    print(f"Cleared {deleted.deleted_count} existing donors")

    donors = []
    with open(csv_path, encoding='utf-8') as f:
        for row in csv.DictReader(f):
            weight = float(row['weight']) if row['weight'] else 50
            donations = int(row['total_number_of_blood_donations']) if row['total_number_of_blood_donations'] else 0
            months = int(row['month_since_last_donation']) if row['month_since_last_donation'] else 0

            donors.append({
                "name": row['name'],
                "email": row['e_mail'],
                "contact": row['contact_number'],
                "place_of_residence": row['place_of_residence'].strip(),
                "current_locality": row['current_locality'].strip(),
                "age": int(row['age']) if row['age'] else 0,
                "weight": weight,
                "blood_group": row['blood_group'],
                "availability": row['availability'].strip().lower() == 'yes',
                "months_since_last_donation": months,
                "total_donations": donations,
                "ml_score": calculate_ml_score(weight, donations, months)
            })

    result = await donors_collection.insert_many(donors)
    print(f"Successfully imported {len(result.inserted_ids)} donors into MongoDB!")

asyncio.run(import_donors())