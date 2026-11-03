package com.onkar.finpilot.service;

import com.onkar.finpilot.dto.DashboardResponse;
import com.onkar.finpilot.entity.User;
import com.onkar.finpilot.enums.TransactionType;
import com.onkar.finpilot.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class DashboardService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseService expenseService;

    public DashboardService(ExpenseRepository expenseRepository, ExpenseService expenseService) {
        this.expenseRepository = expenseRepository;
        this.expenseService = expenseService;
    }

    public DashboardResponse getDashboardSummary() {
        User user = expenseService.getCurrentUser();

        BigDecimal totalIncome = expenseRepository.sumAmountByUserAndType(user, TransactionType.INCOME);
        BigDecimal totalExpense = expenseRepository.sumAmountByUserAndType(user, TransactionType.EXPENSE);
        BigDecimal savings = totalIncome.subtract(totalExpense);
        long totalTransactions = expenseRepository.countByUser(user);

        return new DashboardResponse(
                totalIncome,
                totalExpense,
                savings,
                totalTransactions
        );
    }
}
