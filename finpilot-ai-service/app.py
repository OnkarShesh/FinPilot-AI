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
        print("AI ERROR:", e)   # Terminal me actual error dikhega
        raise HTTPException(
            status_code=503,
            detail="AI service temporarily unavailable"
        )