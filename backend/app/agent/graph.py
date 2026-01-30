from typing import TypedDict, Annotated, List, Union
from datetime import datetime
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
import operator
from .tools import tools
from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv

load_dotenv()

# Define State
class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    interaction_data: dict
    current_hcp: str

# Initialize Model
llm = ChatGroq(
    temperature=0, 
    model_name="llama-3.3-70b-versatile", 
    api_key=os.getenv("GROQ_API_KEY")
)

# Bind Tools
llm_with_tools = llm.bind_tools(tools)

# Define Nodes
SYSTEM_PROMPT = """You are a specialized Medical Science Liaison (MSL) Assistant. 
Your goal is to help MSLs log and manage interactions with Healthcare Professionals (HCPs).

You have access to the following tools:
- log_interaction: Use this to save a new interaction. Required fields: hcp_name, date (YYYY-MM-DD), type (Call, Meeting, Email), notes, and sentiment.
- edit_interaction: Use this to update an existing interaction.
- search_hcp: Search for HCPs by name or specialty.
- get_drug_info: Get info about drugs like OncoBoost or CardioFix.
- schedule_followup: Schedule a follow-up reminder.
- get_recent_interactions: List recent logs.

CRITICAL INSTRUCTIONS:
1. DO NOT output raw tags like <function=...> or similar internal tool-calling syntax in your response to the user.
2. If you want to use a tool, use it directly via the tool-calling mechanism. 
3. After a tool is executed, summarize the result for the user in natural language.
4. If interaction details are provided, log them immediately using `log_interaction`.
5. If details are missing, ask the user concisely.
"""

def chatbot(state: AgentState):
    current_date = datetime.now().strftime("%Y-%m-%d")
    prompt = SYSTEM_PROMPT + f"\n\nCurrent date is: {current_date}"
    messages = [SystemMessage(content=prompt)] + state["messages"]
    return {"messages": [llm_with_tools.invoke(messages)]}

# Build Graph
graph_builder = StateGraph(AgentState)
graph_builder.add_node("chatbot", chatbot)

tool_node = ToolNode(tools)
graph_builder.add_node("tools", tool_node)

graph_builder.add_conditional_edges(
    "chatbot",
    lambda x: "tools" if x["messages"][-1].tool_calls else END,
)
graph_builder.add_edge("tools", "chatbot")

graph_builder.set_entry_point("chatbot")
graph = graph_builder.compile()
