from app.evaluators.semantic_clarity import evaluate_semantic_clarity
from app.evaluators.trust_signal import evaluate_trust_signal
from app.evaluators.discoverability import evaluate_discoverability


def run_evaluations(query, products):

    all_issues = []

    for product in products:

        all_issues.extend(
            evaluate_semantic_clarity(product)
        )

        all_issues.extend(
            evaluate_trust_signal(product)
        )

    all_issues.extend(
        evaluate_discoverability(query, products)
    )

    return all_issues