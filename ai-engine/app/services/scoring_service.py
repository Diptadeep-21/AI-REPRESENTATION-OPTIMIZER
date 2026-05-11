def generate_scores(issues):

    base_score = 100

    for issue in issues:

        severity = issue["severity"]

        if severity == "high":
            base_score -= 20

        elif severity == "medium":
            base_score -= 10

    base_score = max(base_score, 0)

    return {
        "ai_readiness": base_score
    }