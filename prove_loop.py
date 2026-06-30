"""
Day-1 gate: prove the local Cognee loop works with NO OpenAI.
Run this BEFORE building further.

    ollama serve
    ollama pull llama3.1:8b && ollama pull nomic-embed-text
    cp .env.example .env
    python prove_loop.py
"""
import asyncio
from dotenv import load_dotenv
load_dotenv()

from backend import memory

FRAGMENTS = [
    "Around 9pm I was at the Bellagio bar with someone named Sarah.",
    "Sarah said she works as a blackjack dealer and lost my jacket at the pool.",
    "Receipt for $240 from 'Neon Noodle' timestamped 1:14am.",
    "Blurry photo caption: 'me + Sarah + a guy in an Elvis costume'.",
]

async def main():
    await memory.forget()
    for f in FRAGMENTS:
        await memory.remember(f)
    for q in ["What happened last night?", "Who is Sarah?", "Where is my jacket?"]:
        print(f"\n> {q}")
        for r in await memory.recall(q):
            print("  -", getattr(r, "text", r))

if __name__ == "__main__":
    asyncio.run(main())
