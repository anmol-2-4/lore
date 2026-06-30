"""
Thin wrapper over Cognee's memory-lifecycle verbs.

All app code calls THIS module, never cognee directly. The open-source build
points at self-hosted Cognee (Ollama). The separate Cognee Cloud project will
provide its own implementation of these same four functions, so the rest of the
app is backend-agnostic.
"""
import cognee


async def remember(text: str):
    """Ingest a fragment into the memory graph."""
    return await cognee.remember(text)


async def recall(query: str):
    """Retrieve from memory; returns a list of result objects."""
    return await cognee.recall(query_text=query)


async def improve():
    """Enrich / cross-link the graph (a.k.a. memify) for relational answers."""
    return await cognee.improve()


async def forget():
    """Wipe all memory state."""
    return await cognee.forget(everything=True)
