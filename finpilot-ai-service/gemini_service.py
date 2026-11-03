from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

MODELS_TO_TRY = [
    "gemini-3.5-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-3.8-flash"
]

def ask_gemini(prompt: str) -> str:
    last_error = None
    for model_name in MODELS_TO_TRY:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )
            if response and response.text:
                return response.text
        except Exception as e:
            print(f"Model {model_name} failed: {e}. Trying next...")
            last_error = e

    if last_error:
        raise last_error
    raise RuntimeError("Failed to generate response from Gemini API")
