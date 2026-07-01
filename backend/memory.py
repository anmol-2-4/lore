import os

import cognee
from cognee.modules.search.types.SearchType import SearchType

SEARCH_MODES = {
    "ask": SearchType.GRAPH_COMPLETION,
    "reason": SearchType.GRAPH_COMPLETION_COT,
    "timeline": SearchType.TEMPORAL,
}


def _temporal_enabled():
    return os.getenv("WINGMAN_TEMPORAL", "false").lower() in ("1", "true", "yes")


def _answers(result):
    data = result.get("search_result") if isinstance(result, dict) else getattr(result, "search_result", result)
    if isinstance(data, (list, tuple)):
        return [str(x) for x in data]
    return [str(data)]


async def add_fragment(text):
    return await cognee.add(text)


async def reconstruct():
    return await cognee.cognify(temporal_cognify=_temporal_enabled())


async def enrich():
    return await cognee.memify()


async def recall(query, mode="ask"):
    query_type = SEARCH_MODES.get(mode, SearchType.GRAPH_COMPLETION)
    results = await cognee.search(query_text=query, query_type=query_type)
    answers = []
    for r in results:
        answers.extend(_answers(r))
    return answers


async def forget():
    return await cognee.forget(everything=True)


async def graph_html(path):
    return await cognee.visualize_graph(destination_file_path=os.path.abspath(path))
