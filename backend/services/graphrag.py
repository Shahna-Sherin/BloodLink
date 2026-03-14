import requests
import base64
import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv(), override=True)

NEO4J_USER = os.getenv("NEO4J_USER", "fe1b9ecf")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "nNrujjmGcnvKIr1E3SVWgPk8Ra7hXfReEfvfCwlzzAM")
NEO4J_DATABASE = os.getenv("NEO4J_DATABASE", "fe1b9ecf")
QUERY_URL = f"https://fe1b9ecf.databases.neo4j.io/db/{NEO4J_DATABASE}/query/v2"

def run_query(statement, parameters={}):
    credentials = base64.b64encode(f"{NEO4J_USER}:{NEO4J_PASSWORD}".encode()).decode()
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Basic {credentials}"
    }
    response = requests.post(QUERY_URL, json={"statement": statement, "parameters": parameters}, headers=headers)
    if response.status_code in (200, 202):
        return response.json()
    else:
        raise Exception(f"Query failed: {response.status_code} - {response.json()}")

def build_blood_graph():
    blood_types = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
    for bt in blood_types:
        run_query("MERGE (:BloodType {name: $name})", {"name": bt})
    compatibility = {
        "O-":  ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
        "O+":  ["A+", "B+", "O+", "AB+"],
        "A-":  ["A+", "A-", "AB+", "AB-"],
        "A+":  ["A+", "AB+"],
        "B-":  ["B+", "B-", "AB+", "AB-"],
        "B+":  ["B+", "AB+"],
        "AB-": ["AB+", "AB-"],
        "AB+": ["AB+"],
    }
    for donor_type, recipient_types in compatibility.items():
        for recipient_type in recipient_types:
            run_query("""
                MATCH (d:BloodType {name: $donor})
                MATCH (r:BloodType {name: $recipient})
                MERGE (d)-[:CAN_DONATE_TO]->(r)
            """, {"donor": donor_type, "recipient": recipient_type})
    print("Blood compatibility graph built!")

def get_compatible_donors_graph(blood_group: str) -> list:
    result = run_query("""
        MATCH (d:BloodType)-[:CAN_DONATE_TO]->(r:BloodType {name: $blood_group})
        RETURN d.name AS compatible_type
    """, {"blood_group": blood_group})
    return [row[0] for row in result['data']['values']]

def get_donation_path(donor_type: str, recipient_type: str) -> dict:
    result = run_query("""
        MATCH (d:BloodType {name: $donor})-[:CAN_DONATE_TO]->(r:BloodType {name: $recipient})
        RETURN count(*) as compatible
    """, {"donor": donor_type, "recipient": recipient_type})
    count = result['data']['values'][0][0]
    if count > 0:
        return {"compatible": True, "path": [donor_type, recipient_type]}
    return {"compatible": False, "path": []}