package com.onkar.finpilot.repository;

import com.onkar.finpilot.entity.Expense;
import com.onkar.finpilot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<Expense, String> {

    List<Expense> findByUser(User user);
    Optional<Expense> findById(String id);

}