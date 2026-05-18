from fastapi import APIRouter
import random

router = APIRouter()


@router.post("/simulate")
def simulate(data: dict):

    """
    =====================================
    INPUTS
    =====================================
    """

    query = (
        data.get(
            "query",
            ""
        ).lower()
    )

    agent = data.get(
        "agent",
        "GPT-4o"
    )

    analysis = data.get(
        "analysis",
        {}
    )

    product = analysis.get(
        "productId",
        {}
    )

    scores = analysis.get(
        "scores",
        {}
    )

    ai = analysis.get(
        "aiInsights",
        {}
    )

    """
    =====================================
    PRODUCT DATA
    =====================================
    """

    title = product.get(
        "title",
        "Unknown Product"
    )

    description = product.get(
        "description",
        ""
    ).lower()

    category = product.get(
        "category",
        ""
    ).lower()

    tags = product.get(
        "tags",
        []
    )

    """
    =====================================
    BASE SCORES
    =====================================
    """

    overall_score = scores.get(
        "overallScore",
        50
    )

    semantic_gaps = ai.get(
        "semanticGaps",
        []
    )

    """
    =====================================
    QUERY TOKENIZATION
    =====================================
    """

    query_tokens = query.split()

    """
    =====================================
    SEMANTIC MATCHING
    =====================================
    """

    semantic_match_score = 0

    for token in query_tokens:

        if token in title.lower():
            semantic_match_score += 12

        if token in description:
            semantic_match_score += 8

        if token in category:
            semantic_match_score += 10

        if token in tags:
            semantic_match_score += 15

    """
    =====================================
    BUYER INTENT DETECTION
    =====================================
    """

    buyer_intent = []

    premium_keywords = [
        "premium",
        "luxury",
        "high-end",
    ]

    budget_keywords = [
        "cheap",
        "budget",
        "affordable",
    ]

    outdoor_keywords = [
        "outdoor",
        "mountain",
        "trail",
        "hiking",
    ]

    beginner_keywords = [
        "beginner",
        "starter",
        "easy",
    ]

    if any(
        k in query
        for k in premium_keywords
    ):
        buyer_intent.append(
            "premium"
        )

    if any(
        k in query
        for k in budget_keywords
    ):
        buyer_intent.append(
            "budget"
        )

    if any(
        k in query
        for k in outdoor_keywords
    ):
        buyer_intent.append(
            "outdoor"
        )

    if any(
        k in query
        for k in beginner_keywords
    ):
        buyer_intent.append(
            "beginner"
        )

    """
    =====================================
    AI AGENT WEIGHTING
    =====================================
    """

    agent_bonus = {

        "GPT-4o Shopping": 5,

        "Gemini Commerce": 4,

        "Claude Shopping": 3,

        "Perplexity Retail": 2,

    }.get(agent, 2)

    """
    =====================================
    GAP PENALTY
    =====================================
    """

    gap_penalty = (
        len(semantic_gaps) * 3
    )

    """
    =====================================
    FINAL SCORE
    =====================================
    """

    final_score = max(

        min(

            overall_score
            + semantic_match_score
            + agent_bonus
            - gap_penalty,

            99
        ),

        20
    )

    """
    =====================================
    DYNAMIC VISIBILITY
    =====================================
    """

    visibility = (

        "HIGH"

        if final_score >= 85

        else "MEDIUM"

        if final_score >= 65

        else "LOW"
    )

    """
    =====================================
    DETERMINISTIC RESULT SIZE
    =====================================
    """

    query_complexity = len(
        query_tokens
    )

    semantic_depth = len(tags)

    total_results = max(

        8,

        min(

            25,

            (
                query_complexity * 2
            )

            +

            semantic_depth

            +

            (
                len(semantic_gaps)
            )

            +

            5
        )
    )

    """
    =====================================
    DYNAMIC RANKING
    =====================================
    """

    ranked_at = max(

        1,

        int(

            total_results

            -

            (
                final_score / 10
            )
        )
    )

    """
    =====================================
    POSITIVES
    =====================================
    """

    positives = []

    if semantic_match_score >= 20:

        positives.append({

            "title":
                "Strong Query Alignment",

            "detail":
                (
                    "Product strongly matches "
                    "buyer search intent."
                )
        })

    if overall_score >= 80:

        positives.append({

            "title":
                "High AI Readiness",

            "detail":
                (
                    "Product metadata is "
                    "well optimized for "
                    "AI discovery."
                )
        })

    if len(semantic_gaps) <= 2:

        positives.append({

            "title":
                "Strong Metadata Coverage",

            "detail":
                (
                    "Low semantic gap count "
                    "improves discoverability."
                )
        })

    if "premium" in buyer_intent:

        positives.append({

            "title":
                "Premium Intent Match",

            "detail":
                (
                    "Product aligns with "
                    "premium buyer behavior."
                )
        })

    """
    =====================================
    NEGATIVE REASONING
    =====================================
    """

    negatives = []

    if len(semantic_gaps) >= 5:

        negatives.append({

            "title":
                "Weak Semantic Coverage",

            "detail":
                (
                    "Large semantic gaps "
                    "reduce AI ranking confidence."
                )
        })

    if semantic_match_score <= 10:

        negatives.append({

            "title":
                "Low Query Relevance",

            "detail":
                (
                    "Product weakly matches "
                    "buyer search intent."
                )
        })

    if overall_score < 60:

        negatives.append({

            "title":
                "Poor Optimization Quality",

            "detail":
                (
                    "Product metadata lacks "
                    "strong AI optimization."
                )
        })

    """
    =====================================
    FALLBACK POSITIVE
    =====================================
    """

    if len(positives) == 0:

        positives.append({

            "title":
                "Moderate Commercial Relevance",

            "detail":
                (
                    "Product partially aligns "
                    "with buyer shopping intent."
                )
        })

    """
    =====================================
    QUERY-AWARE GAPS
    =====================================
    """

    gaps = []

    for token in query_tokens:

        if token in semantic_gaps:

            gaps.append({

                "title":
                    token,

                "detail":
                    (
                        f"Missing '{token}' "
                        f"semantic optimization "
                        f"for this query."
                    )
            })

    if len(gaps) == 0:

        for gap in semantic_gaps[:4]:

            gaps.append({

                "title":
                    gap,

                "detail":
                    (
                        f"Missing '{gap}' "
                        f"semantic optimization."
                    )
            })

    """
    =====================================
    DYNAMIC REASONING
    =====================================
    """

    ranking_reason = (

        f"{title} achieved "

        f"{visibility} AI visibility "

        f"for '{query}' "

        f"based on semantic relevance, "

        f"metadata quality, "

        f"and buyer intent alignment."
    )

    """
    =====================================
    FINAL RESPONSE
    =====================================
    """

    return {

        "query":
            query,

        "agent":
            agent,

        "product":
            title,

        "rankedAt":
            ranked_at,

        "totalResults":
            total_results,

        "confidenceScore":
            final_score,

        "visibilityScore":
            final_score,

        "semanticMatch":
            visibility,

        "llmVisibility":
            visibility,

        "rankingConfidence":
            final_score,

        "rankingReason":
            ranking_reason,

        "reason":
            ai.get(
                "summary",
                "Moderate AI visibility."
            ),

        "positives":
            positives,

        "negatives":
            negatives,

        "gaps":
            gaps,

        "recommendedProducts": [

            {
                "title":
                    title,

                "score":
                    final_score,
            }
        ],
    }