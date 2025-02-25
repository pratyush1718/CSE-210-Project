import io
from tqdm import tqdm
from transformers import AutoProcessor, MusicgenForConditionalGeneration
import torch
import scipy

class MusicGen:
    def __init__(self):
        self.device = self._get_device()
        self.processor = AutoProcessor.from_pretrained('./musicgen-small')
        self.model = MusicgenForConditionalGeneration.from_pretrained(
            './musicgen-small').to(self.device)

    def _get_device(self):
        return "cuda:0" if torch.cuda.is_available() else "cpu"

    def generate_music(self, prompt, length: 256):
        torch.cuda.empty_cache()
        torch.cuda.synchronize()
        inputs = self.processor(
            text=[prompt],
            padding=True,
            return_tensors="pt",
        ).to(self.device)

        # 256 tokens is 5 seconds of audio
        audio_values = self.model.generate(
            **inputs, 
            max_new_tokens=length
            )
        audio_values = audio_values.cpu()

        sampling_rate = self.model.config.audio_encoder.sampling_rate
        # Create an in-memory binary stream
        wav_bytes = io.BytesIO()
        scipy.io.wavfile.write(wav_bytes, rate=sampling_rate, data=audio_values[0, 0].numpy())
        wav_bytes.seek(0)  # Reset the stream position to the beginning

        return wav_bytes

if __name__ == "__main__":
    musicgen = MusicGen()
    tests = [
        "Lo-Fi for Sleeping & Meditating",
        "Lo-Fi for Studying",
        "Tropical House",
        "New Wave",
        "Coffee Shop",
        "Melodic Trap, West Coast",
        "IDM, Smooth",
        "Ambient, Dreamy",
        "Synthwave, Retro",
    ]
    for prompt in tqdm(tests):
        wav_bytes = musicgen.generate_music(prompt, 512)
        # store wav_bytes in a file
        with open(f"./samples/{prompt}.wav", "wb") as f:
            f.write(wav_bytes.getvalue())
