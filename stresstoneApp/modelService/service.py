import os
from fastapi.concurrency import asynccontextmanager
from fastapi.responses import FileResponse
from typing import Literal
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import io
from musicgen import MusicGen
import uvicorn
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

class TextToMusic(BaseModel):
    text: str
    length: Literal["test", "short", "medium", "long"]


model = MusicGen()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to specific origins if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/text_to_music")
async def text_to_music(text_prompt: TextToMusic):
    prompt = text_prompt.text
    length = text_prompt.length

    if length == "short":
        tokens = 256
    elif length == "medium":
        tokens = 512
    elif length == "long":
        tokens = 1024
    elif length == "test":
        tokens = 64
    else:
        raise HTTPException(status_code=422, detail="Invalid length parameter")

    music_stream = model.generate_music(prompt, tokens)
    if not music_stream:
        raise HTTPException(status_code=422, detail="Music generation failed")

    # Return the music stream as a response
    return StreamingResponse(io.BytesIO(music_stream.getbuffer()), media_type="audio/wav")
