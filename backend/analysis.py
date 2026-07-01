from backend import memory

CONTRADICTION_QUERY = (
    "Review all the remembered facts about the night. Identify any pairs of facts "
    "that contradict or are inconsistent with each other, and explain each conflict. "
    "If there are no contradictions, say so plainly."
)


async def find_contradictions():
    return await memory.recall(CONTRADICTION_QUERY, mode="reason")
