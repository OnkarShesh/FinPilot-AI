import json

def build_prompt(data):

    expenses = []

    for expense in data.expenses:
        expenses.append({
            "category": expense.category,
            "amount": expense.amount
        })

    return f"""
You are an expert financial advisor.

Analyze the following financial data.

Income:
{data.income}

Expenses:
{json.dumps(expenses, indent=2)}

Return ONLY valid JSON.

Format:

{{
    "healthScore": number,
    "savingsRate": number,
    "topSpendingCategory": "string",
    "financialStatus": "Excellent | Good | Average | Poor",
    "recommendations": [
        "recommendation1",
        "recommendation2",
        "recommendation3"
    ]
}}

Rules:

- Do not explain anything.
- Do not write markdown.
- Do not write ```json.
- Return JSON only.
"""