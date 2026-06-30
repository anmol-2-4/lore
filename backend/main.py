from pathlib import Path

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from backend import memory

ROOT = Path(__file__).resolve().parent.parent
FRONTEND = ROOT / "frontend"
GRAPH_FILE = ROOT / "data" / "graph.html"
app = FastAPI(title="Wingman")


class Fragment(BaseModel):
    text: str


class Query(BaseModel):
    text: str
    mode: str = "ask"


@app.post("/api/fragment")
async def fragment(frag: Fragment):
    await memory.add_fragment(frag.text)
    return {"ok": True}


@app.post("/api/reconstruct")
async def reconstruct():
    await memory.reconstruct()
    return {"ok": True}


@app.post("/api/enrich")
async def enrich():
    await memory.enrich()
    return {"ok": True}


@app.post("/api/recall")
async def recall(q: Query):
    answers = await memory.recall(q.text, q.mode)
    return {"answers": answers}


@app.post("/api/forget")
async def forget():
    await memory.forget()
    return {"ok": True}


@app.get("/api/graph")
async def graph():
    await memory.graph_html(str(GRAPH_FILE))
    return FileResponse(GRAPH_FILE)


app.mount("/static", StaticFiles(directory=FRONTEND), name="static")


@app.get("/")
async def index():
    return FileResponse(FRONTEND / "index.html")
