import asyncio
from dotenv import load_dotenv
load_dotenv()

from backend import analysis, memory
from cognee.infrastructure.databases.graph import get_graph_engine

FRAGMENTS = [
    "Around 9pm I was at the Bellagio bar with someone named Sarah.",
    "Sarah said she works as a blackjack dealer and lost my jacket at the pool.",
    "Receipt for $240 from 'Neon Noodle' timestamped 1:14am.",
    "Blurry photo caption: 'me + Sarah + a guy in an Elvis costume'.",
    "Hotel keycard sleeve: room 1207, The Venetian.",
    "Text from an unknown number at 2:03am: 'you still owe me for the cab lol'.",
    "I'm now pretty sure I left my jacket in the back of the taxi, not at the pool.",
]

QUESTIONS = ["What happened last night?", "Who is Sarah?", "Where is my jacket?"]


async def main():
    await memory.forget()
    await memory.remember(FRAGMENTS)

    print("\n=====ANSWERS=====")
    for q in QUESTIONS:
        print(f"\n> {q}")
        for a in await memory.recall(q):
            print("  " + a)

    print("\n=====CONTRADICTIONS=====")
    for c in await analysis.find_contradictions():
        print("  " + c)

    await memory.graph_html("data/graph.html")
    engine = await get_graph_engine()
    nodes, edges = await engine.get_graph_data()
    print(f"\n=====GRAPH===== {len(nodes)} nodes, {len(edges)} edges")


if __name__ == "__main__":
    asyncio.run(main())
