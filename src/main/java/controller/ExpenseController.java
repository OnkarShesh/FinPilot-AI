package com.onkar.finpilot.controller;

import com.onkar.finpilot.dto.ExpenseRequest;
import com.onkar.finpilot.service.ExpenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.onkar.finpilot.entity.Expense;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<String> addExpense(@RequestBody ExpenseRequest request) {

        expenseService.addExpense(request);

        return ResponseEntity.ok("Expense added successfully");
    }
    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {

        List<Expense> expenses = expenseService.getAllExpenses();

        return ResponseEntity.ok(expenses);
    }
}
