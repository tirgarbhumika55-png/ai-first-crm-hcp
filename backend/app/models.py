from sqlalchemy import Column, Integer, String
from .database import Base

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String, index=True)
    date = Column(String)
    type = Column(String)
    notes = Column(String)
    sentiment = Column(String)
    status = Column(String, default="Logged")

class HCP(Base):
    __tablename__ = "hcps"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    specialty = Column(String)
