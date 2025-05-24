package com.massaro.expense_predictor.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Setter
@Getter
@ToString
@Entity
@Table(name = "custom_recurring_transactions")
public class CustomRecurringTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "parent_recurring_transaction_id")
    private RecurringTransaction parentRecurringTransaction;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDate originalTransactionDate;

    @Column(nullable = false)
    private boolean paid;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
