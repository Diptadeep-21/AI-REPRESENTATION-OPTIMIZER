def evaluate_discoverability(product):

    score = 100

    issues = []

    tags = product.get("tags", [])

    if len(tags) < 3:

        score -= 40

        issues.append(
            "Insufficient semantic tags"
        )

    return {
        "score": score,
        "issues": issues
    }