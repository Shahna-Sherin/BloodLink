import requests
import base64
import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv(), override=True)

NEO4J_USER = os.getenv("NEO4J_USER", "fe1b9ecf")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "nNrujjmGcnvKIr1E3SVWgPk8Ra7hXfReEfvfCwlzzAM")
NEO4J_DATABASE = os.getenv("NEO4J_DATABASE", "fe1b9ecf")
QUERY_URL = f"https://fe1b9ecf.databases.neo4j.io/db/{NEO4J_DATABASE}/query/v2"

def get_headers():
    credentials = base64.b64encode(f"{NEO4J_USER}:{NEO4J_PASSWORD}".encode()).decode()
    return {
        "Content-Type": "application/json",
        "Authorization": f"Basic {credentials}"
    }

def run_query(statement, parameters={}):
    payload = {"statement": statement, "parameters": parameters}
    response = requests.post(QUERY_URL, json=payload, headers=get_headers())
    if response.status_code in (200, 202):
        return response.json()
    else:
        raise Exception(f"Neo4j query failed: {response.status_code} - {response.json()}")

def close_driver():
    pass

print(f"✅ NEO4J HTTP API ready: {QUERY_URL}")