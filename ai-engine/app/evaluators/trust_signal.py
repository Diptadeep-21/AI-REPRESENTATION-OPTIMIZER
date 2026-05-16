def evaluate_trust_signal(product):

    score = 100

    issues = []

    if not product.get("return_policy"):

        score -= 0

    return {
        "score": score,
        "issues": issues
    }