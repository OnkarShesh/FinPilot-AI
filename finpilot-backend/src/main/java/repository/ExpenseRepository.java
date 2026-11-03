package com.onkar.finpilot.repository;

import com.onkar.finpilot.dto.ExpenseItem;
import com.onkar.finpilot.entity.Expense;
import com.onkar.finpilot.entity.User;
import com.onkar.finpilot.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, String> {

    List<Expense> findByUserOrderByDateDesc(User user);

    List<Expense> findByUser(User user);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user = :user AND e.type = :type")
    BigDecimal sumAmountByUserAndType(@Param("user") User user, @Param("type") TransactionType type);

    @Query("SELECT COUNT(e) FROM Expense e WHERE e.user = :user")
    long countByUser(@Param("user") User user);

    @Query("SELECT new com.onkar.finpilot.dto.ExpenseItem(e.category, SUM(e.amount)) " +
           "FROM Expense e " +
           "WHERE e.user = :user AND e.type = :type " +
           "GROUP BY e.category")
    List<ExpenseItem> findCategoryTotalsByUserAndType(@Param("user") User user, @Param("type") TransactionType type);
}
