from fastapi import APIRouter
from pydantic import BaseModel
from app.agents.hcp_agent import run_hcp_agent

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
def chat_with_agent(req: ChatRequest):
    response = run_hcp_agent(req.message)
    return {"response": response}
