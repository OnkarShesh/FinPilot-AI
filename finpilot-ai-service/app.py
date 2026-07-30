from fastapi import FastAPI, HTTPException
from gemini_service import ask_gemini
from prompt import build_prompt
from schemas import ExpenseAnalysisRequest, AnalysisResponse
import json

app = FastAPI()

@app.post("/analyze", response_model=AnalysisResponse)
def analyze(data: ExpenseAnalysisRequest):
    try:
        prompt = build_prompt(data)
        answer = ask_gemini(prompt)

        cleaned = (
            answer.replace("```json", "")
            .replace("```", "")
            .strip()
        )

        return json.loads(cleaned)

    except Exception as e:

        print("AI ERROR:", e)

        error_message = str(e)

        if "RESOURCE_EXHAUSTED" in error_message or "429" in error_message:
            raise HTTPException(
                status_code=429,
                detail="Daily AI request limit reached. Please try again later."
            )

        raise HTTPException(
            status_code=503,
            detail="AI service is temporarily unavailable."
        )