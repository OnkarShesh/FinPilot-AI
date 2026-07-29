package com.onkar.finpilot.dto;

import java.util.List;
import com.onkar.finpilot.dto.ExpenseItem;

public class ExpenseAnalysisRequest {

    private double income;
    private List<ExpenseItem> expenses;

    public ExpenseAnalysisRequest() {
    }

    public ExpenseAnalysisRequest(double income, List<ExpenseItem> expenses) {
        this.income = income;
        this.expenses = expenses;
    }

    public double getIncome() {
        return income;
    }

    public void setIncome(double income) {
        this.income = income;
    }

    public List<ExpenseItem> getExpenses() {
        return expenses;
    }

    public void setExpenses(List<ExpenseItem> expenses) {
        this.expenses = expenses;
    }
}

