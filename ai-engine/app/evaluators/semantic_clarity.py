def evaluate_semantic_clarity(product):

    issues = []

    description = product.get("description", "")

    vague_words = [
        "premium",
        "modern",
        "quality",
        "best"
    ]

    for word in vague_words:
        if word in description.lower():
            issues.append({
                "type": "vague_description",
                "severity": "medium",
                "reason": f"Contains vague marketing word: {word}"
            })

    return issues