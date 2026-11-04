package com.onkar.finpilot.service;

import com.onkar.finpilot.dto.ExpenseRequest;
import com.onkar.finpilot.entity.Expense;
import com.onkar.finpilot.entity.User;
import com.onkar.finpilot.repository.ExpenseRepository;
import com.onkar.finpilot.security.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");
        }
        return ((CustomUserDetails) authentication.getPrincipal()).getUser();
    }

    public void addExpense(ExpenseRequest request) {
        User user = getCurrentUser();

        Expense expense = new Expense();
        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setDate(request.getDate());
        expense.setDescription(request.getDescription());
        expense.setType(request.getType());
        expense.setUser(user);

        expenseRepository.save(expense);
    }

    public List<Expense> getAllExpenses() {
        User user = getCurrentUser();
        return expenseRepository.findByUserOrderByDateDescCreatedAtDesc(user);
    }

    public void updateExpense(String id, ExpenseRequest request) {
        User user = getCurrentUser();

        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expense not found"));

        if (!expense.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to update this expense");
        }

        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setDate(request.getDate());
        expense.setDescription(request.getDescription());
        expense.setType(request.getType());

        expenseRepository.save(expense);
    }

    public void deleteExpense(String id) {
        User user = getCurrentUser();

        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expense not found"));

        if (!expense.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not allowed to delete this expense");
        }

        expenseRepository.delete(expense);
    }

    @org.springframework.transaction.annotation.Transactional
    public void batchDeleteExpenses(List<String> ids) {
        if (ids == null || ids.isEmpty()) return;
        User user = getCurrentUser();
        for (String id : ids) {
            Expense expense = expenseRepository.findById(id).orElse(null);
            if (expense != null && expense.getUser().getId().equals(user.getId())) {
                expenseRepository.delete(expense);
            }
        }
    }
}
