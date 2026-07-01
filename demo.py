import asyncio
from dotenv import load_dotenv
load_dotenv()

from backend import memory
from cognee.infrastructure.databases.graph import get_graph_engine

FRAGMENTS = [
    "Around 9pm I was at the Bellagio bar with someone named Sarah.",
    "Sarah said she works as a blackjack dealer and lost my jacket at the pool.",
    "Receipt for $240 from 'Neon Noodle' timestamped 1:14am.",
    "Blurry photo caption: 'me + Sarah + a guy in an Elvis costume'.",
    "Hotel keycard sleeve: room 1207, The Venetian.",
    "Text from an unknown number at 2:03am: 'you still owe me for the cab lol'.",
]

QUESTIONS = ["What happened last night?", "Who is Sarah?", "Where is my jacket?"]


def prop(d, *keys):
    if isinstance(d, dict):
        for k in keys:
            if d.get(k):
                return d[k]
    return None


async def main():
    await memory.forget()
    for f in FRAGMENTS:
        await memory.add_fragment(f)
    await memory.reconstruct()

    print("\n=====ANSWERS=====")
    for q in QUESTIONS:
        print(f"\n> {q}")
        for a in await memory.recall(q):
            print(a)

    await memory.graph_html("data/graph.html")
    print("\n=====GRAPH_HTML===== data/graph.html")

    engine = await get_graph_engine()
    nodes, edges = await engine.get_graph_data()
    print(f"\n=====GRAPH_TEXT===== nodes={len(nodes)} edges={len(edges)}")
    names = {}
    for nid, props in nodes:
        name = prop(props, "name", "id") or str(nid)
        ntype = prop(props, "type") or "?"
        names[nid] = name
        print(f"NODE  {name}  [{ntype}]")
    for e in edges:
        src, tgt, rel = e[0], e[1], (e[2] if len(e) > 2 else "")
        print(f"EDGE  {names.get(src, src)}  --{rel}-->  {names.get(tgt, tgt)}")


if __name__ == "__main__":
    asyncio.run(main())
