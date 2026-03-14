from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import donors, requests, alerts, graph
import traceback

app = FastAPI(title="BloodLink API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://blood-link-xi.vercel.app",
        "https://blood-link-qs4zwbrl6-shahna-sherins-projects.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": str(exc), "trace": traceback.format_exc()}
    )

app.include_router(donors.router)
app.include_router(requests.router)
app.include_router(alerts.router)
app.include_router(graph.router)

@app.get("/")
def root():
    return {"status": "BloodLink API is running ✅"}

@app.get("/health")
def health():
    return {"mongo": "connected", "neo4j": "connected", "ml": "ready"}