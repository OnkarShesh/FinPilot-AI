package com.onkar.finpilot;

import com.onkar.finpilot.entity.Expense;
import com.onkar.finpilot.entity.User;
import com.onkar.finpilot.repository.ExpenseRepository;
import com.onkar.finpilot.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class FinpilotApplicationTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Test
    void inspectDatabaseData() {
        System.out.println("================= DB INSPECTION =================");
        List<User> users = userRepository.findAll();
        for (User u : users) {
            System.out.println("USER: " + u.getId() + " | " + u.getName() + " | " + u.getEmail());
            List<Expense> expenses = expenseRepository.findByUser(u);
            double income = 0;
            double expense = 0;
            for (Expense e : expenses) {
                System.out.println("   -> " + e.getType() + " | " + e.getTitle() + " | " + e.getAmount() + " | " + e.getCategory());
                if (e.getType() == com.onkar.finpilot.enums.TransactionType.INCOME) {
                    income += e.getAmount().doubleValue();
                } else {
                    expense += e.getAmount().doubleValue();
                }
            }
            System.out.println("   TOTAL INCOME = " + income + " | TOTAL EXPENSE = " + expense);
        }
        System.out.println("=================================================");
    }
}
