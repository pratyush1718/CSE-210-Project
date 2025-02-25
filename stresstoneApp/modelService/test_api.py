import pytest
from fastapi.testclient import TestClient
from service import app

client = TestClient(app)

def test_text_to_music_short():
    response = client.post(
        "/text_to_music", json={"text": "Lo-Fi for Studying", "length": "short"})
    assert response.status_code == 200
    assert response.headers["content-type"] == "audio/wav"
    assert len(response.content) > 0
    with open(f"./test_result/short.wav", "wb") as f:
        f.write(response.content)

def test_text_to_music_medium():
    response = client.post(
        "/text_to_music", json={"text": "Sea wave", "length": "medium"})
    assert response.status_code == 200
    assert response.headers["content-type"] == "audio/wav"
    assert len(response.content) > 0
    with open(f"./test_result/medium.wav", "wb") as f:
        f.write(response.content)

def test_text_to_music_long():
    response = client.post(
        "/text_to_music", json={"text": "Melodic Trap, West Coast", "length": "long"})
    assert response.status_code == 200
    assert response.headers["content-type"] == "audio/wav"
    assert len(response.content) > 0
    with open(f"./test_result/long.wav", "wb") as f:
        f.write(response.content)

def test_text_to_music_test():
    response = client.post(
        "/text_to_music", json={"text": "calm", "length": "test"})
    assert response.status_code == 200
    assert response.headers["content-type"] == "audio/wav"
    assert len(response.content) > 0
    with open(f"./test_result/test.wav", "wb") as f:
        f.write(response.content)

# Length of error data type
def test_text_to_music_invalid_length():
    response = client.post(
        "/text_to_music", json={"text": "invalid", "length": 500})
    assert response.status_code == 422

# No text input
def test_text_to_music_missing_text():
    response = client.post("/text_to_music", json={"length": "short"})
    assert response.status_code == 422

# No length input
def test_text_to_music_missing_length():
    response = client.post("/text_to_music", json={"text": "happy"})
    assert response.status_code == 422
