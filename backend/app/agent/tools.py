from typing import Union
from langchain_core.tools import tool
from pydantic import BaseModel, Field
from datetime import datetime
from ..database import SessionLocal
from ..models import Interaction, HCP

# 1. Log Interaction Tool
class LogInteractionInput(BaseModel):
    hcp_name: str = Field(..., description="Name of the Healthcare Professional")
    date: str = Field(..., description="Date of interaction in YYYY-MM-DD format")
    type: str = Field(..., description="Type of interaction: Call, Meeting, Email")
    notes: str = Field(..., description="Summary of the discussion")
    sentiment: str = Field("Neutral", description="Observed sentiment: Positive, Neutral, Negative")

@tool("log_interaction", args_schema=LogInteractionInput)
def log_interaction(hcp_name: str, date: str, type: str, notes: str, sentiment: str = "Neutral"):
    """Logs a new interaction with an HCP into the CRM system."""
    db = SessionLocal()
    try:
        new_interaction = Interaction(
            hcp_name=hcp_name,
            date=date,
            type=type,
            notes=notes,
            sentiment=sentiment,
            status="Logged"
        )
        db.add(new_interaction)
        db.commit()
        db.refresh(new_interaction)
        return f"Interaction logged successfully with ID: {new_interaction.id}"
    except Exception as e:
        return f"Error logging interaction: {str(e)}"
    finally:
        db.close()

# 2. Edit Interaction Tool
class EditInteractionInput(BaseModel):
    interaction_id: Union[int, str] = Field(..., description="ID of the interaction to edit")
    field: str = Field(..., description="Field to update (notes, date, sentiment)")
    new_value: str = Field(..., description="New value for the field")

@tool("edit_interaction", args_schema=EditInteractionInput)
def edit_interaction(interaction_id: Union[int, str], field: str, new_value: str):
    """Edits a specific field of an existing interaction log."""
    interaction_id = int(interaction_id)
    db = SessionLocal()
    try:
        interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
        if not interaction:
            return f"Interaction with ID {interaction_id} not found."
        
        if hasattr(interaction, field):
            setattr(interaction, field, new_value)
            db.commit()
            return f"Interaction {interaction_id} updated. {field} set to {new_value}."
        else:
            return f"Invalid field: {field}"
    except Exception as e:
        return f"Error editing interaction: {str(e)}"
    finally:
        db.close()

# 3. Search HCP Tool
@tool
def search_hcp(query: str):
    """Searches for an HCP by name or specialty."""
    db = SessionLocal()
    try:
        # Check if we have any HCPs, if not add mocks (simple seeding)
        if db.query(HCP).count() == 0:
             db.add_all([
                 HCP(name="Dr. Smith", specialty="Cardiology"),
                 HCP(name="Dr. Johnson", specialty="Oncology"),
                 HCP(name="Dr. Williams", specialty="Neurology")
             ])
             db.commit()

        results = db.query(HCP).filter(
            (HCP.name.ilike(f"%{query}%")) | (HCP.specialty.ilike(f"%{query}%"))
        ).all()
        
        if not results:
            return "No HCPs found."
        
        return [{"id": h.id, "name": h.name, "specialty": h.specialty} for h in results]
    finally:
        db.close()

# 4. Get Drug Info Tool
@tool
def get_drug_info(drug_name: str):
    """Retrieves standard information/dosage about a drug."""
    # Mock data
    if "oncoboost" in drug_name.lower():
        return "OncoBoost: Indicated for Stage 3 NSCLC. Dosage: 10mg daily. Side effects: Nausea."
    elif "cardiofix" in drug_name.lower():
        return "CardioFix: Beta-blocker. Dosage: 50mg daily."
    return "Drug information not found in local database."

# 5. Schedule Follow-up Tool
@tool
def schedule_followup(hcp_name: str, date: str, topic: str):
    """Schedules a follow-up meeting or reminder."""
    # In a real app, this would hit Outlook/Google Calendar API
    return f"Scheduled follow-up with {hcp_name} on {date} regarding '{topic}'."

# 6. Get Recent Interactions Tool
class GetRecentInteractionsInput(BaseModel):
    limit: Union[int, str] = Field(5, description="Number of recent interactions to retrieve")

@tool("get_recent_interactions", args_schema=GetRecentInteractionsInput)
def get_recent_interactions(limit: Union[int, str] = 5):
    """Retrieves the most recent interactions logged in the CRM."""
    limit = int(limit)
    db = SessionLocal()
    try:
        interactions = db.query(Interaction).order_by(Interaction.id.desc()).limit(limit).all()
        if not interactions:
            return "No interactions found."
        
        return [
            {
                "id": i.id, 
                "hcp": i.hcp_name, 
                "date": i.date, 
                "type": i.type, 
                "notes": i.notes, 
                "sentiment": i.sentiment
            } 
            for i in interactions
        ]
    finally:
        db.close()

tools = [log_interaction, edit_interaction, search_hcp, get_drug_info, schedule_followup, get_recent_interactions]
