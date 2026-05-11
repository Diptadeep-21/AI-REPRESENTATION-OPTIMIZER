from app.agents.audit_agent import run_audit


def run_audit_pipeline(query):

    result = run_audit(query)

    return result