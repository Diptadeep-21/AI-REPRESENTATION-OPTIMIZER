def run_audit(data):

    product = data["product"]

    scores = data["scores"]

    issues = data["issues"]

    recommendations = (
        data["recommendations"]
    )

    title = product.get(
        "title", ""
    )

    description = product.get(
        "description", ""
    )

    tags = product.get(
        "tags", []
    )

    overall_score = scores.get(
        "overallScore", 0
    )

    """
    =====================================
    AI VISIBILITY PREDICTION
    =====================================
    """

    visibility_prediction = {

        "chatgpt":
            "High"
            if overall_score > 80
            else "Medium",

        "perplexity":
            "Medium"
            if overall_score > 60
            else "Low",

        "amazonRufus":
            "Medium"
    }

    """
    =====================================
    SEMANTIC GAP DETECTION
    =====================================
    """

    semantic_gaps = []

    important_terms = [
        "waterproof",
        "durable",
        "lightweight",
        "outdoor",
        "premium",
        "trail"
    ]

    combined_text = (
        title.lower()
        + " "
        + description.lower()
    )

    for term in important_terms:

        if term not in combined_text:

            semantic_gaps.append(term)

    """
    =====================================
    OPTIMIZED TITLE
    =====================================
    """

    optimized_title = (
        f"Premium {title} "
        f"for Outdoor Adventures"
    )

    """
    =====================================
    OPTIMIZED DESCRIPTION
    =====================================
    """

    optimized_description = (
        description
        + " Optimized for AI shopping "
        + "assistant discoverability "
        + "and semantic retrieval."
    )

    """
    =====================================
    AI SUMMARY
    =====================================
    """

    summary = (
        "This product demonstrates "
        "moderate AI discoverability "
        "but lacks sufficient semantic "
        "richness for strong AI-agent "
        "ranking."
    )

    """
    =====================================
    IMPROVEMENT PRIORITY
    =====================================
    """

    improvement_priority = (
        "HIGH"
        if overall_score < 75
        else "MEDIUM"
    )

    return {

        "summary": summary,

        "visibilityPrediction":
            visibility_prediction,

        "optimizedTitle":
            optimized_title,

        "optimizedDescription":
            optimized_description,

        "semanticGaps":
            semantic_gaps,

        "improvementPriority":
            improvement_priority,
    }