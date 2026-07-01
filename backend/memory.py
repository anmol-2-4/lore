import os

import cognee
from cognee.modules.search.types.SearchType import SearchType

SEARCH_MODES = {
    "ask": SearchType.GRAPH_COMPLETION,
    "reason": SearchType.GRAPH_COMPLETION_COT,
    "timeline": SearchType.TEMPORAL,
}


def _text(entry):
    if isinstance(entry, dict):
        return entry.get("text") or entry.get("search_result") or str(entry)
    for field in ("text", "answer", "content"):
        value = getattr(entry, field, None)
        if value:
            return value if isinstance(value, str) else str(value)
    return str(entry)


async def remember(texts):
    return await cognee.remember(texts, self_improvement=False)


async def recall(query, mode="ask"):
    query_type = SEARCH_MODES.get(mode, SearchType.GRAPH_COMPLETION)
    results = await cognee.recall(query_text=query, query_type=query_type)
    return [_text(r) for r in results]


async def improve():
    return await cognee.improve()


async def forget():
    return await cognee.forget(everything=True)


async def graph_html(path):
    return await cognee.visualize_graph(destination_file_path=os.path.abspath(path))
