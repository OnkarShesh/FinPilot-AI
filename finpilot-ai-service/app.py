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

import re

def fallback_python_parse(text: str, today_date: str):
    lower = text.lower().strip()
    if lower in ["hi", "hello", "hey", "help"] or "help" in lower:
        return {
            "is_valid": False,
            "title": "FinPilot AI",
            "amount": 0.0,
            "category": "Other",
            "type": "EXPENSE",
            "date": today_date,
            "reply_message": "👋 *Hello from FinPilot AI!*\n\nYou can text me your daily expenses anytime:\n• _Paid 450 for swiggy_\n• _500 petrol_\n• _Salary 50000_\n\nI will instantly log it into your live dashboard!"
        }

    # Extract amount (handles 2.5k, 500rs, etc.)
    k_match = re.search(r"(\d+(?:\.\d+)?)\s*k\b", lower)
    amount = None
    if k_match:
        try:
            amount = float(k_match.group(1)) * 1000
        except Exception:
            pass

    if not amount:
        num_match = re.search(r"(?<!\w)(\d+(?:\.\d+)?)(?!\w)", lower)
        if num_match:
            try:
                val = float(num_match.group(1))
                if val > 0:
                    amount = val
            except Exception:
                pass

    if not amount:
        return {
            "is_valid": False,
            "title": "Expense",
            "amount": 0.0,
            "category": "Other",
            "type": "EXPENSE",
            "date": today_date,
            "reply_message": "👋 *FinPilot AI*: Could not detect an amount. Please specify the amount, e.g. _Paid 450 for lunch_ or _Salary 50000_."
        }

    income_keywords = [
        "credit", "credited", "cr", "income", "salary", "stipend", "deposit", "deposited",
        "received", "receive", "got", "earned", "earning", "dividend", "freelance", "bonus",
        "cashback", "refund", "refunded", "profit", "allowance", "inflow", "agye", "aagaye",
        "aaye", "aaya", "aa gaye", "mila", "mili", "mile", "jama", "addd", "added", "account mai",
        "account me", "account mein", "balance in account"
    ]
    expense_keywords = [
        "debit", "debited", "dr", "spent", "spend", "paid", "kharcha", "kharch",
        "diya", "diye", "deducted", "cut", "kata", "kate"
    ]

    has_income = any(re.search(rf"\b{re.escape(w)}\b" if len(w) <= 4 else re.escape(w), lower) for w in income_keywords)
    if "add" in lower and "address" not in lower:
        has_income = True

    has_expense = any(re.search(rf"\b{re.escape(w)}\b", lower) for w in expense_keywords)

    is_income = has_income and not has_expense
    tx_type = "INCOME" if is_income else "EXPENSE"

    category = "Other"
    if any(w in lower for w in ["swiggy", "zomato", "pizza", "burger", "dinner", "lunch", "food", "chai", "coffee", "tea", "poha", "maggie", "grocery", "groceries", "blinkit", "zepto"]):
        category = "Food"
    elif any(w in lower for w in ["petrol", "diesel", "uber", "ola", "cab", "auto", "metro", "travel", "flight", "bus"]):
        category = "Travel"
    elif any(w in lower for w in ["amazon", "flipkart", "shopping", "clothes", "shoes", "myntra"]):
        category = "Shopping"
    elif any(w in lower for w in ["bill", "recharge", "wifi", "electricity", "water", "gas"]):
        category = "Bills"
    elif any(w in lower for w in ["rent", "pg", "flat"]):
        category = "Rent"
    elif any(w in lower for w in ["movie", "cinema", "netflix", "hotstar"]):
        category = "Entertainment"
    elif any(w in lower for w in ["doctor", "medicine", "pharmacy", "hospital", "gym"]):
        category = "Health"
    elif is_income:
        if "salary" in lower:
            category = "Salary"
        elif "bonus" in lower or "cashback" in lower:
            category = "Bonus"
        elif "freelance" in lower:
            category = "Freelance"
        else:
            category = "Deposit"

    # Clean title
    clean_title = re.sub(r"(?i)\b(\d+(?:\.\d+)?)\s*k?\b", "", text)
    clean_title = re.sub(r"(?i)\b(paid|spent|got|received|rs|inr|rupees|₹|for|on|in|ko|ka|ke|se|mai|me|mein|hai|abhi|account|agye|aagaye|aaye|aaya|mila|mili|mile|addd|added|add|credit|credited|cr|debit|debited|dr)\b", "", clean_title)
    clean_title = re.sub(r"[^a-zA-Z0-9\s]", " ", clean_title)
    clean_title = re.sub(r"\s+", " ", clean_title).strip()

    if len(clean_title) > 30:
        clean_title = clean_title[:30].strip()

    if not clean_title:
        if is_income:
            if "salary" in lower:
                clean_title = "Salary"
            elif "bonus" in lower:
                clean_title = "Bonus"
            elif "cashback" in lower or "refund" in lower:
                clean_title = "Cashback"
            else:
                clean_title = "Account Inflow"
        else:
            clean_title = "Account Debit" if "debit" in lower else f"{category} Expense"
    else:
        clean_title = clean_title[0].upper() + clean_title[1:]

    receipt = (
        f"✅ *Transaction Recorded!*\n"
        f"🏷️ *Title:* {clean_title}\n"
        f"💰 *Amount:* ₹{amount:g}\n"
        f"📂 *Category:* {category}\n"
        f"📊 *Type:* {tx_type}\n\n"
        f"_Updated live on your FinPilot Dashboard!_"
    )

    return {
        "is_valid": True,
        "title": clean_title,
        "amount": amount,
        "category": category,
        "type": tx_type,
        "date": today_date,
        "reply_message": receipt
    }

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
        print("NLP PARSE ERROR:", e, "Using local parser fallback.")
        return fallback_python_parse(data.text, data.today_date)

@app.get("/")
def health():
    return {"status": "AI Service Running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
