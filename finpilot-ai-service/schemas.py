from pydantic import BaseModel
from typing import Optional

class ExpenseItem(BaseModel):
    category: str
    amount: float

class ExpenseAnalysisRequest(BaseModel):
    income: float
    expenses: list[ExpenseItem]

class AnalysisResponse(BaseModel):
    healthScore: int
    savingsRate: float
    topSpendingCategory: str
    financialStatus: str
    recommendations: list[str]

class ParseTransactionRequest(BaseModel):
    text: str
    today_date: Optional[str] = None

class ParsedTransactionResponse(BaseModel):
    is_valid: bool
    title: Optional[str] = "Expense"
    amount: Optional[float] = 0.0
    category: Optional[str] = "Other"
    type: Optional[str] = "EXPENSE"
    date: Optional[str] = None
    reply_message: str
