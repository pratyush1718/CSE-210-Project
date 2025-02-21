# Model Service Documentation

## Running Model Service
- Locally download [Musicgen model](https://huggingface.co/facebook/musicgen-small) and decompress into `musicgen-small` folder
- Run service.py with `uvicorn service:app --reload` for dev. Service run on `8000` port.

## Dependencies 

Hardware requirements:
- GPU server
- Nvidia GPU (4G VRAM or higher) [Running on CUDA, Unified Memory devices (e.g., Apple Silicon etc.) need code changes]

Software requirements:
- Python 3.9
- `requirements.txt`

## Reference Manuals
- Musicgen model [https://huggingface.co/facebook/musicgen-small]
- Musicgen prompts [https://promptecho.com/musicgen?utm_source=musicgen_prompts]
- FastAPI [https://fastapi.tiangolo.com/]