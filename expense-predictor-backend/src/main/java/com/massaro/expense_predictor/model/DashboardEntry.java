package com.massaro.expense_predictor.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class DashboardEntry {

    private final Long recurringTransactionId;
    private final Long singleTransactionId;
    private final Long customRecurringTransactionId;
    private final LocalDate date;
    private final String description;
    @JsonIgnore
    private final Account account;
    private BigDecimal before;
    private final BigDecimal amount;
    private BigDecimal after;

    @JsonProperty
    public String getAccountName() {
        return account.getName();
    }
}
