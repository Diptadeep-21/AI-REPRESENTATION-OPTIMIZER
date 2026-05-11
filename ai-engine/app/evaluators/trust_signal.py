def evaluate_trust_signal(product):

    issues = []

    if not product.get("return_policy"):
        issues.append({
            "type": "missing_return_policy",
            "severity": "high",
            "reason": "No return policy found"
        })

    return issues