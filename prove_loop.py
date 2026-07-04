import asyncio
from dotenv import load_dotenv
load_dotenv()

from backend import memory

DECISIONS = [
    "We chose PostgreSQL over MongoDB because our core data is highly relational.",
    "Auth uses short-lived JWT access tokens because the mobile app can't reliably persist cookies.",
    "We moved the job queue onto Redis after the in-memory queue dropped tasks on every deploy.",
    "The public API is rate-limited to 100 requests per minute per key.",
]


async def main():
    await memory.forget()
    await memory.remember(DECISIONS)
    for q in ["Why did we choose Postgres?", "Why JWT instead of sessions?", "Why is the queue on Redis?"]:
        print(f"\n> {q}")
        for answer in await memory.recall(q):
            print("  " + answer)


if __name__ == "__main__":
    asyncio.run(main())
