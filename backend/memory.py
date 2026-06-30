import cognee
from cognee.modules.search.types.SearchType import SearchType

SEARCH_MODES = {
    "ask": SearchType.GRAPH_COMPLETION,
    "reason": SearchType.GRAPH_COMPLETION_COT,
    "timeline": SearchType.TEMPORAL,
}


async def add_fragment(text):
    return await cognee.add(text)


async def reconstruct():
    return await cognee.cognify(temporal_cognify=True)


async def enrich():
    return await cognee.memify()


async def recall(query, mode="ask"):
    query_type = SEARCH_MODES.get(mode, SearchType.GRAPH_COMPLETION)
    results = await cognee.search(query_text=query, query_type=query_type)
    answers = []
    for r in results:
        value = getattr(r, "search_result", r)
        answers.append(value if isinstance(value, str) else str(value))
    return answers


async def forget():
    return await cognee.forget(everything=True)


async def graph_html(path):
    return await cognee.visualize_graph(destination_file_path=path)
