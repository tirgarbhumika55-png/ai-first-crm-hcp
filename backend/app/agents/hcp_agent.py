from langgraph.graph import StateGraph
from typing import TypedDict

from app.tools.log_interaction import log_interaction
from app.tools.edit_interaction import edit_interaction
from app.tools.get_hcp_history import get_hcp_history
from app.tools.suggest_next_action import suggest_next_action
from app.tools.compliance_checker import compliance_checker



class AgentState(TypedDict):
    message: str
    result: str

def agent_node(state: AgentState):
    text = state["message"].lower()

    if "edit" in text:
        result = edit_interaction(text)
    elif "history" in text:
        result = get_hcp_history(text)
    elif "next" in text:
        result = suggest_next_action(text)
    elif "compliance" in text:
        result = compliance_checker(text)
    else:
        result = log_interaction(text)

    return {"result": result}

def run_hcp_agent(message: str):
    workflow = StateGraph(AgentState)
    workflow.add_node("agent", agent_node)
    workflow.set_entry_point("agent")
    graph = workflow.compile()

    output = graph.invoke({"message": message})
    return output["result"]
