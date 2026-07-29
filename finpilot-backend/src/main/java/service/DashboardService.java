package com.onkar.finpilot.service;

import com.onkar.finpilot.dto.DashboardResponse;
import com.onkar.finpilot.entity.Expense;
import com.onkar.finpilot.enums.TransactionType;
import org.springframework.stereotype.Service;
import com.onkar.finpilot.service.ExpenseService;
import java.util.List;

@Service
public class DashboardService {

    private final ExpenseService expenseService;

    public DashboardService(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    public DashboardResponse getDashboardSummary() {

        List<Expense> transactions = expenseService.getAllExpenses();

        double totalIncome = 0.0;
        double totalExpense = 0.0;

        for (Expense transaction : transactions) {

            if (transaction.getType() == TransactionType.INCOME) {
                totalIncome += transaction.getAmount();
            } else {
                totalExpense += transaction.getAmount();
            }
        }

        double savings = totalIncome - totalExpense;

        return new DashboardResponse(
                totalIncome,
                totalExpense,
                savings,
                transactions.size()
        );
    }
}