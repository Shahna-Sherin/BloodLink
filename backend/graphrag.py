import requests
import base64

NEO4J_USER = "fe1b9ecf"
NEO4J_PASSWORD = "nNrujjmGcnvKIr1E3SVWgPk8Ra7hXfReEfvfCwlzzAM"
NEO4J_DATABASE = "fe1b9ecf"
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

def get_compatible_donors(recipient_blood_type: str):
    """Find all blood types that can donate to the recipient"""
    result = run_query("""
        MATCH (d:BloodType)-[:CAN_DONATE_TO]->(r:BloodType {name: $blood_type})
        RETURN d.name as donor_type
    """, {"blood_type": recipient_blood_type})
    donors = [row[0] for row in result['data']['values']]
    return donors

def get_compatible_recipients(donor_blood_type: str):
    """Find all blood types that can receive from this donor"""
    result = run_query("""
        MATCH (d:BloodType {name: $blood_type})-[:CAN_DONATE_TO]->(r:BloodType)
        RETURN r.name as recipient_type
    """, {"blood_type": donor_blood_type})
    recipients = [row[0] for row in result['data']['values']]
    return recipients

def check_compatibility(donor: str, recipient: str):
    """Check if donor can donate to recipient"""
    result = run_query("""
        MATCH (d:BloodType {name: $donor})-[:CAN_DONATE_TO]->(r:BloodType {name: $recipient})
        RETURN count(*) as compatible
    """, {"donor": donor, "recipient": recipient})
    count = result['data']['values'][0][0]
    return count > 0

if __name__ == "__main__":
    print("Testing GraphRAG queries...")
    print(f"Who can donate to AB+? {get_compatible_donors('AB+')}")
    print(f"Who can O- donate to? {get_compatible_recipients('O-')}")
    print(f"Can O+ donate to A+? {check_compatibility('O+', 'A+')}")
    print(f"Can A+ donate to O+? {check_compatibility('A+', 'O+')}")