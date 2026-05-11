from app.services.retrieval_service import retrieve_products
from app.services.evaluation_service import run_evaluations
from app.services.scoring_service import generate_scores


def run_audit(query):

    products = retrieve_products(query)

    issues = run_evaluations(query, products)

    scores = generate_scores(issues)

    recommendations = []

    for issue in issues:

        if issue["type"] == "vague_description":
            recommendations.append(
                "Add specific material and use-case details"
            )

        if issue["type"] == "missing_return_policy":
            recommendations.append(
                "Add clear return policy information"
            )

        if issue["type"] == "low_discoverability":
            recommendations.append(
                "Improve semantic relevance of product descriptions"
            )

    return {
        "scores": scores,
        "issues": issues,
        "recommendations": list(set(recommendations)),
        "retrieved_products": products
    }