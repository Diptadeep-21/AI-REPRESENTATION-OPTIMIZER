from fastapi import APIRouter

import re

router = APIRouter()


"""
=========================================================
TEXT NORMALIZATION
=========================================================
"""


def normalize_text(text):

    if not text:
        return ""

    text = text.lower()

    text = re.sub(
        r"<[^>]*>",
        " ",
        text
    )

    text = re.sub(
        r"[^a-z0-9\s]",
        " ",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


"""
=========================================================
INTENT DETECTION
=========================================================
"""


INTENT_MAP = {

    "minimal": [
        "minimal",
        "simple",
        "basic",
        "clean",
    ],

    "premium": [
        "premium",
        "luxury",
        "best",
        "high-end",
        "professional",
    ],

    "beginner": [
        "beginner",
        "starter",
        "easy",
        "affordable",
    ],

    "accessory": [
        "accessory",
        "accessories",
        "gear",
        "wax",
    ],

    "winter": [
        "winter",
        "snow",
        "outdoor",
        "sports",
    ],

    "performance": [
        "performance",
        "advanced",
        "pro",
        "elite",
    ],
}


def detect_query_intents(query):

    query = normalize_text(query)

    intents = []

    for intent, keywords in INTENT_MAP.items():

        for keyword in keywords:

            if keyword in query:

                intents.append(intent)

                break

    return intents


"""
=========================================================
SIMULATION ROUTE
=========================================================
"""


@router.post("/simulate")
def simulate(data: dict):

    """
    =========================================================
    INPUTS
    =========================================================
    """

    query = normalize_text(
        data.get(
            "query",
            ""
        )
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
    =========================================================
    PRODUCT DATA
    =========================================================
    """

    title = product.get(
        "title",
        "Unknown Product"
    )

    description = normalize_text(
        product.get(
            "description",
            ""
        )
    )

    category = normalize_text(
        product.get(
            "category",
            ""
        )
    )

    tags = [

        normalize_text(tag)

        for tag in product.get(
            "tags",
            []
        )
    ]

    vendor = normalize_text(
        product.get(
            "vendor",
            ""
        )
    )

    product_type = normalize_text(
        product.get(
            "productType",
            ""
        )
    )

    metadata = product.get(
        "metadata",
        {}
    )

    title_lower = normalize_text(
        title
    )

    """
    =========================================================
    PRODUCT PROFILE
    =========================================================
    """

    combined_text = " ".join([

        title_lower,

        description,

        category,

        vendor,

        product_type,

        " ".join(tags),
    ])

    """
    =========================================================
    QUERY TOKENS
    =========================================================
    """

    query_tokens = query.split()

    """
    =========================================================
    QUERY INTENTS
    =========================================================
    """

    intents = detect_query_intents(
        query
    )

    """
    =========================================================
    SEMANTIC MATCH SCORE
    =========================================================
    """

    semantic_match_score = 0

    for token in query_tokens:

        if token in combined_text:

            semantic_match_score += 12

    semantic_match_score = min(
        semantic_match_score,
        100
    )

    """
    =========================================================
    METADATA QUALITY SCORE
    =========================================================
    """

    metadata_quality = 0

    if description:
        metadata_quality += 20

    if tags:
        metadata_quality += 20

    if product.get("images"):
        metadata_quality += 15

    if vendor:
        metadata_quality += 10

    if product_type:
        metadata_quality += 10

    if metadata.get("material"):
        metadata_quality += 10

    if metadata.get("terrain"):
        metadata_quality += 15

    metadata_quality = min(
        metadata_quality,
        100
    )

    """
    =========================================================
    INTENT BONUS
    =========================================================
    """

    intent_bonus = 0

    is_minimal = (
        "minimal" in combined_text
    )

    is_premium = (

        "premium" in combined_text

        or

        product.get(
            "price",
            0
        ) > 700
    )

    is_accessory = (

        "accessory" in combined_text

        or

        "wax" in combined_text
    )

    is_beginner = (

        "hydrogen" in combined_text

        or

        "starter" in combined_text
    )

    if "minimal" in intents:

        if is_minimal:
            intent_bonus += 30
        else:
            intent_bonus -= 10

    if "premium" in intents:

        if is_premium:
            intent_bonus += 25

    if "accessory" in intents:

        if is_accessory:
            intent_bonus += 35
        else:
            intent_bonus -= 15

    if "beginner" in intents:

        if is_beginner:
            intent_bonus += 25

    if "winter" in intents:

        if (
            "winter" in combined_text
            or
            "snow" in combined_text
        ):
            intent_bonus += 15

    """
    =========================================================
    AI AGENT BONUS
    =========================================================
    """

    agent_bonus = {

        "GPT-4o Shopping": 5,

        "Gemini Commerce": 4,

        "Claude Shopping": 3,

        "Perplexity Retail": 2,

    }.get(agent, 2)

    """
    =========================================================
    BASE SCORE
    =========================================================
    """

    overall_score = scores.get(
        "overallScore",
        55
    )

    """
    =========================================================
    FINAL SCORE
    =========================================================
    """

    final_score = round(

        (
            overall_score * 0.40
        )

        +

        (
            semantic_match_score * 0.30
        )

        +

        (
            metadata_quality * 0.15
        )

        +

        (
            intent_bonus
        )

        +

        (
            agent_bonus
        )

    )

    final_score = max(
        25,
        min(
            final_score,
            99
        )
    )

    """
    =========================================================
    VISIBILITY
    =========================================================
    """

    visibility = (

        "HIGH"

        if final_score >= 85

        else "MEDIUM"

        if final_score >= 65

        else "LOW"
    )

    """
    =========================================================
    TOTAL RESULTS
    =========================================================
    """

    total_results = max(

        8,

        min(

            25,

            len(query_tokens) * 2

            +

            len(tags)

            +

            8
        )
    )

    """
    =========================================================
    RANKING
    =========================================================
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
    =========================================================
    WHY IT RANKED
    =========================================================
    """

    positives = []

    if "minimal" in intents and is_minimal:

        positives.append({

            "title":
                "Minimal Intent Match",

            "detail":
                (
                    "Product strongly aligns "
                    "with simplicity-focused "
                    "buyer intent."
                )
        })

    if "premium" in intents and is_premium:

        positives.append({

            "title":
                "Premium Positioning",

            "detail":
                (
                    "Product aligns with "
                    "premium shopping behavior."
                )
        })

    if "accessory" in intents and is_accessory:

        positives.append({

            "title":
                "Accessory Search Match",

            "detail":
                (
                    "Product strongly matches "
                    "accessory-focused search intent."
                )
        })

    if "beginner" in intents and is_beginner:

        positives.append({

            "title":
                "Beginner Friendly Match",

            "detail":
                (
                    "Product aligns well "
                    "with beginner shoppers."
                )
        })

    if "winter" in intents:

        positives.append({

            "title":
                "Winter Sports Relevance",

            "detail":
                (
                    "Product contains strong "
                    "winter commerce relevance."
                )
        })

    if semantic_match_score >= 35:

        positives.append({

            "title":
                "Strong Query Alignment",

            "detail":
                (
                    "Product strongly matches "
                    "buyer search language."
                )
        })

    if metadata_quality >= 60:

        positives.append({

            "title":
                "Strong Metadata Quality",

            "detail":
                (
                    "Product metadata improves "
                    "AI discoverability."
                )
        })

    if len(positives) == 0:

        positives.append({

            "title":
                "General Commerce Relevance",

            "detail":
                (
                    "Product maintains moderate "
                    "buyer-intent relevance."
                )
        })

    """
    =========================================================
    NEGATIVE REASONING
    =========================================================
    """

    negatives = []

    if metadata_quality < 40:

        negatives.append({

            "title":
                "Weak Metadata Structure",

            "detail":
                (
                    "Limited product metadata "
                    "reduces AI visibility."
                )
        })

    if semantic_match_score < 15:

        negatives.append({

            "title":
                "Low Query Alignment",

            "detail":
                (
                    "Product weakly matches "
                    "buyer search phrasing."
                )
        })

    if not tags:

        negatives.append({

            "title":
                "Limited Semantic Tags",

            "detail":
                (
                    "Additional semantic tags "
                    "could improve ranking."
                )
        })

    """
    =========================================================
    DYNAMIC SEMANTIC GAPS
    =========================================================
    """

    gaps = []

    if not description:

        gaps.append({

            "title":
                "Missing Product Description",

            "detail":
                (
                    "Detailed descriptions would "
                    "improve AI understanding."
                )
        })

    if not tags:

        gaps.append({

            "title":
                "Limited Semantic Coverage",

            "detail":
                (
                    "Additional semantic tags "
                    "could improve discoverability."
                )
        })

    if not product.get("images"):

        gaps.append({

            "title":
                "Missing Product Imagery",

            "detail":
                (
                    "Visual product assets "
                    "could improve commerce trust."
                )
        })

    if "minimal" in intents:

        gaps.append({

            "title":
                "Minimal Design Signals",

            "detail":
                (
                    "Additional simplicity-focused "
                    "descriptors could improve matching."
                )
        })

    if "premium" in intents:

        gaps.append({

            "title":
                "Luxury Commerce Signals",

            "detail":
                (
                    "Advanced premium metadata "
                    "could strengthen ranking."
                )
        })

    if "accessory" in intents:

        gaps.append({

            "title":
                "Compatibility Metadata",

            "detail":
                (
                    "Accessory compatibility "
                    "data is limited."
                )
        })

    if "winter" in intents:

        if not metadata.get("terrain"):

            gaps.append({

                "title":
                    "Terrain Optimization",

                "detail":
                    (
                        "Terrain-specific optimization "
                        "data is missing."
                    )
            })

    """
    =========================================================
    REMOVE DUPLICATE GAPS
    =========================================================
    """

    unique_gaps = []

    seen = set()

    for gap in gaps:

        if gap["title"] not in seen:

            unique_gaps.append(gap)

            seen.add(gap["title"])

    gaps = unique_gaps[:5]

    """
    =========================================================
    RANKING REASON
    =========================================================
    """

    ranking_reason = (

        f"{title} achieved "

        f"{visibility} visibility "

        f"for '{query}' "

        f"due to semantic relevance, "

        f"buyer-intent alignment, "

        f"metadata quality, "

        f"and AI-commerce optimization."
    )

    """
    =========================================================
    FINAL RESPONSE
    =========================================================
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
            positives[:4],

        "negatives":
            negatives[:3],

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