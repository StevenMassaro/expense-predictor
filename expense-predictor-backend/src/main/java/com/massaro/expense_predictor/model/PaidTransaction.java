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
@Table(name = "paid_transactions")
public class PaidTransaction {
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
    private LocalDateTime createdAt = LocalDateTime.now();
}
