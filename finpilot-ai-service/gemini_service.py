from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def ask_gemini(prompt: str):
    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt
    )

    return response.text
    print(response.text)

    return response.text