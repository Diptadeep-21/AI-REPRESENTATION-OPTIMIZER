from app.evaluators.semantic_clarity import (
    evaluate_semantic_clarity
)


def test_semantic_clarity():

    product = {
        "description": "Premium modern shoes"
    }

    issues = evaluate_semantic_clarity(product)

    assert len(issues) > 0