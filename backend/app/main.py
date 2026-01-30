from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from .agent.graph import graph
from .database import engine, get_db, Base
from .models import Interaction

# Create Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI-First CRM HCP API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    user_id: str = "default_user"

@app.post("/agent/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        initial_state = {
            "messages": [("user", request.message)],
            "interaction_data": {},
            "current_hcp": ""
        }
        # Invoke LangGraph
        result = graph.invoke(initial_state)
        
        # Get the last message from agent
        last_message = result["messages"][-1]
        return {"response": last_message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class InteractionCreate(BaseModel):
    hcp_name: str
    date: str
    type: str
    notes: str
    sentiment: str = "Neutral"

@app.post("/interactions")
def create_interaction(interaction: InteractionCreate, db: Session = Depends(get_db)):
    db_interaction = Interaction(
        hcp_name=interaction.hcp_name,
        date=interaction.date,
        type=interaction.type,
        notes=interaction.notes,
        sentiment=interaction.sentiment,
        status="Logged"
    )
    db.add(db_interaction)
    db.commit()
    db.refresh(db_interaction)
    return db_interaction

@app.get("/interactions")
def get_interactions(db: Session = Depends(get_db)):
    return db.query(Interaction).order_by(Interaction.id.desc()).all()

@app.get("/health")
def health_check():
    return {"status": "ok"}
