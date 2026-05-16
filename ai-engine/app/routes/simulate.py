from fastapi import APIRouter

router = APIRouter()


@router.post("/simulate")
def simulate(data: dict):

    query = data.get(
        "query",
        ""
    )

    """
    =====================================
    MOCK AI SHOPPING SIMULATION
    =====================================
    """

    return {

        "query": query,

        "visibilityScore":
            82,

        "recommendationLikelihood":
            "HIGH",

        "rankingReason":
            (
                "Strong semantic "
                "alignment with "
                "shopping intent."
            ),

        "recommendedProducts": [

            {
                "title":
                    "The Videographer Snowboard",

                "score":
                    71,
            }
        ],

        "aiAgentFeedback":
            (
                "This product has "
                "moderate AI visibility "
                "but requires stronger "
                "semantic metadata."
            ),
    }