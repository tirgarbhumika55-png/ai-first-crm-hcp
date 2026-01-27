from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from app.routes.interaction import router as interaction_router

app = FastAPI(title="AI-First CRM HCP")

app.include_router(interaction_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "AI-First CRM HCP Backend Running"}
