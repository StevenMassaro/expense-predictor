package com.massaro.expense_predictor.model;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class DashboardEntry {

    private final LocalDate date;
    private final String description;
    private final String accountName;
    private final BigDecimal before;
    private final BigDecimal amount;
    private final BigDecimal after;
}
