def evaluate_metadata_quality(product):

    score = 100

    issues = []

    required_fields = [
        "title",
        "description",
        "tags",
        "category"
    ]

    for field in required_fields:

        if not product.get(field):

            score -= 20

            issues.append(
                f"Missing metadata field: {field}"
            )

    return {
        "score": score,
        "issues": issues
    }