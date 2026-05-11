import json
import numpy as np
import faiss

from app.services.embedding_service import generate_embedding

with open("data/sample_store.json", "r") as f:
    products = json.load(f)

texts = [p["description"] for p in products]

embeddings = np.array(
    [generate_embedding(text) for text in texts]
).astype("float32")

index = faiss.IndexFlatL2(len(embeddings[0]))
index.add(embeddings)


def search(query: str, k=2):

    query_embedding = np.array(
        [generate_embedding(query)]
    ).astype("float32")

    distances, indices = index.search(query_embedding, k)

    results = [products[i] for i in indices[0]]

    return results