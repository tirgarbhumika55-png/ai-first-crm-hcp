# AI-First CRM: HCP Interaction Module

## Overview
This project is an **AI-First Customer Relationship Management (CRM)** system designed for **Healthcare Professionals (HCPs)**. It features a "Log Interaction" module that allows Field Representatives (MSLs) to log sales calls and meetings either manually or via a conversational AI Agent.

## Key Features
- **Dual Interface**: Structured Form & Conversational AI Chat.
- **AI Agent**: Powered by **LangGraph** & **Groq (Gemma2-9b-it)**.
    - Tools: Log Interaction, Edit Interaction, Search HCP, Get Drug Info.
- **Modern UI**: React (Vite) with Tailwind CSS, Framer Motion, and Glassmorphism design.
- **State Management**: Redux Toolkit.
- **Backend**: FastAPI with SQLite & SQLAlchemy.

## Tech Stack
- **Frontend**: React, Redux, Tailwind, Lucide-React, Framer Motion.
- **Backend**: Python, FastAPI, LangGraph, LangChain, SQLAlchemy.
- **Database**: SQLite (Local `crm.db`).
- **LLM**: Groq API.

## Installation & Setup

### Prerequisites
- Node.js & npm
- Python 3.9+
- Groq API Key

### 1. Clone Repository
```bash
git clone <repo-url>
cd ai-first-crm-hcp
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```
**Environment Variables**:
Create a `.env` file in `backend/` and add:
```
GROQ_API_KEY=your_key_here
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

## Running the Application

**1. Start Backend Server**
```bash
cd backend
uvicorn app.main:app --reload
# Port: 8000
```

**2. Start Frontend Server**
```bash
cd frontend
npm run dev
# Port: 5173
```

## Usage
1. Open the frontend URL (e.g., `http://localhost:5173`).
2. Use the **Left Panel** to manually log interactions.
3. Use the **Right Panel (AI Assistant)** to chat naturally (e.g., "Log a call with Dr. Smith regarding OncoBoost").
4. Both methods save to the same SQLite database.

## Architecture
- **/backend**: Contains the FastAPI app, LangGraph agent definitions (`graph.py`, `tools.py`), and DB models.
- **/frontend**: Contains the React SPA, Redux store (`interactionSlice.js`), and UI components.
