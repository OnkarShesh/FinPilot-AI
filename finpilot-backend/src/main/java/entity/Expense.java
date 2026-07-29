package com.onkar.finpilot.entity;

import jakarta.persistence.*;
import lombok.*;
import com.onkar.finpilot.entity.User ;

import java.time.LocalDate;
import com.onkar.finpilot.enums.TransactionType;

@Entity
@Table(name = "expenses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String title;

    private Double amount;

    private String category;

    private LocalDate date;

    private String description;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}