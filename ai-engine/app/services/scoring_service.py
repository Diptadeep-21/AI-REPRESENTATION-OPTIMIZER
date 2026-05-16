def generate_scores(

    metadata_score,
    discoverability_score,
    trust_score,
    semantic_score,
    media_score

):

    overall = int(

        (
            metadata_score +
            discoverability_score +
            trust_score +
            semantic_score +
            media_score

        ) / 5
    )

    return {

        "metadataScore": metadata_score,

        "discoverabilityScore":
            discoverability_score,

        "trustScore": trust_score,

        "mediaScore": media_score,

        "semanticScore": semantic_score,

        "overallScore": overall
    }