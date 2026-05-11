from app.services.retrieval_service import retrieve_products


def test_retrieval():

    query = "waterproof trekking shoes"

    results = retrieve_products(query)

    assert len(results) > 0