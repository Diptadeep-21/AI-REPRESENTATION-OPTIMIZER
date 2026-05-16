from app.services.retrieval_service import (
    retrieve_products
)

from app.evaluators.metadata_quality import (
    evaluate_metadata_quality
)

from app.evaluators.discoverability import (
    evaluate_discoverability
)

from app.evaluators.trust_signal import (
    evaluate_trust_signal
)

from app.services.scoring_service import (
    generate_scores
)


def run_audit(query):

    products = retrieve_products(query)

    product = products[0]

    metadata_result = (
        evaluate_metadata_quality(product)
    )

    discoverability_result = (
        evaluate_discoverability(product)
    )

    trust_result = (
        evaluate_trust_signal(product)
    )

    semantic_score = 60
    media_score = 80

    deterministic_scores = generate_scores(

        metadata_result["score"],

        discoverability_result["score"],

        trust_result["score"],

        semantic_score,

        media_score
    )

    issues = []

    issues.extend(
        metadata_result["issues"]
    )

    issues.extend(
        discoverability_result["issues"]
    )

    issues.extend(
        trust_result["issues"]
    )

    recommendations = []

    if "Insufficient semantic tags" in issues:

        recommendations.append(
            "Add semantic tags"
        )

    recommendations.append(
        "Upload more images"
    )

    return {

        "product": product,

        "deterministicScores":
            deterministic_scores,

        "issues": issues,

        "recommendations":
            recommendations
    }