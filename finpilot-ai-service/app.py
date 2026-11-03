from fastapi import FastAPI, HTTPException
from gemini_service import ask_gemini
from prompt import build_prompt
from parse_prompt import build_parse_prompt
from schemas import (
    ExpenseAnalysisRequest,
    AnalysisResponse,
    ParseTransactionRequest,
    ParsedTransactionResponse
)
import json

app = FastAPI(title="FinPilot AI Engine")

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

@app.post("/parse-transaction", response_model=ParsedTransactionResponse)
def parse_transaction(data: ParseTransactionRequest):
    try:
        prompt = build_parse_prompt(data.text, data.today_date)
        answer = ask_gemini(prompt)

        cleaned = (
            answer.replace("```json", "")
            .replace("```", "")
            .strip()
        )

        return json.loads(cleaned)

    except Exception as e:
        print("NLP PARSE ERROR:", e)
        return {
            "is_valid": False,
            "title": "Expense",
            "amount": 0.0,
            "category": "Other",
            "type": "EXPENSE",
            "date": data.today_date,
            "reply_message": "⚠️ Could not understand the transaction details. Please try texting: 'Paid 450 for pizza' or '1800 petrol'."
        }

@app.get("/")
def health():
    return {"status": "AI Service Running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
