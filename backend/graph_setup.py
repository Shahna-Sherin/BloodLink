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

def create_blood_compatibility_graph():
    print("🔨 Building blood compatibility knowledge graph...")

    blood_types = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    for bt in blood_types:
        run_query("MERGE (b:BloodType {name: $name})", {"name": bt})
    print("✅ Blood type nodes created")

    compatibility = {
        "O-":  ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
        "O+":  ["O+", "A+", "B+", "AB+"],
        "A-":  ["A-", "A+", "AB-", "AB+"],
        "A+":  ["A+", "AB+"],
        "B-":  ["B-", "B+", "AB-", "AB+"],
        "B+":  ["B+", "AB+"],
        "AB-": ["AB-", "AB+"],
        "AB+": ["AB+"],
    }

    for donor, recipients in compatibility.items():
        for recipient in recipients:
            run_query("""
                MATCH (d:BloodType {name: $donor})
                MATCH (r:BloodType {name: $recipient})
                MERGE (d)-[:CAN_DONATE_TO]->(r)
            """, {"donor": donor, "recipient": recipient})
    print("✅ Compatibility relationships created")

    result = run_query("MATCH (n:BloodType) RETURN count(n) as count")
    count = result['data']['values'][0][0]
    print(f"✅ Graph complete! {count} blood type nodes in database")

if __name__ == "__main__":
    create_blood_compatibility_graph()