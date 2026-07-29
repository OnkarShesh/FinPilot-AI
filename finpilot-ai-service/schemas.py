from pydantic import BaseModel

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