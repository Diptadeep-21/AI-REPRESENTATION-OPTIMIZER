def evaluate_discoverability(query, retrieved_products):

    issues = []

    relevant_found = False

    for product in retrieved_products:
        text = product["description"].lower()

        if any(word in text for word in query.lower().split()):
            relevant_found = True

    if not relevant_found:
        issues.append({
            "type": "low_discoverability",
            "severity": "high",
            "reason": "Products are not semantically aligned with query"
        })

    return issues