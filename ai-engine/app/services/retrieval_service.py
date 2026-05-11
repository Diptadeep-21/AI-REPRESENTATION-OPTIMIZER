from app.rag.vector_index import search


def retrieve_products(query: str):
    return search(query)