package com.massaro.expense_predictor.endpoint;

import com.massaro.expense_predictor.model.DashboardEntry;
import com.massaro.expense_predictor.model.Recurrence;
import com.massaro.expense_predictor.model.RecurringTransaction;
import com.massaro.expense_predictor.repository.RecurringTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/dashboard")
public class DashboardEndpoint {

    @Autowired
    private RecurringTransactionRepository recurringTransactionRepository;

    @GetMapping
    public List<DashboardEntry> list() {
        List<RecurringTransaction> recurringTransactions = recurringTransactionRepository.findAll();
        List<DashboardEntry> dashboardEntries = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneYearFromNow = now.plusYears(1);

        for (RecurringTransaction recurringTransaction : recurringTransactions) {
            LocalDateTime createdAt = recurringTransaction.getCreatedAt();
            Recurrence recurrence = recurringTransaction.getRecurrence();
            int recurrenceDay = recurringTransaction.getRecurrenceDay(); // day of month or day of year
            String description = recurringTransaction.getName();
            BigDecimal amount = recurringTransaction.getAmount();

            LocalDate nextOccurrence;
            if (recurrence == Recurrence.monthly) {
                nextOccurrence = createdAt.toLocalDate().withDayOfMonth(Math.min(recurrenceDay, 28)); // fallback to 28 to avoid invalid dates
                while (!nextOccurrence.isAfter(oneYearFromNow.toLocalDate())) {
                    dashboardEntries.add(new DashboardEntry(
                            nextOccurrence.atStartOfDay().toLocalDate(), description, recurringTransaction.getAccountName(), null, amount, null
                    ));
                    nextOccurrence = nextOccurrence.plusMonths(1).withDayOfMonth(Math.min(recurrenceDay, nextOccurrence.lengthOfMonth()));
                }
            } else if (recurrence == Recurrence.annually) {
                LocalDate createdDate = createdAt.toLocalDate();
                int year = createdDate.getYear();
                int month = createdDate.getMonthValue();
                nextOccurrence = LocalDate.of(year, month, Math.min(recurrenceDay, YearMonth.of(year, month).lengthOfMonth()));
                while (!nextOccurrence.isAfter(oneYearFromNow.toLocalDate())) {
                    dashboardEntries.add(new DashboardEntry(
                            nextOccurrence.atStartOfDay().toLocalDate(), description, recurringTransaction.getAccountName(), null, amount, null
                    ));
                    year++;
                    int daysInMonth = YearMonth.of(year, month).lengthOfMonth();
                    nextOccurrence = LocalDate.of(year, month, Math.min(recurrenceDay, daysInMonth));
                }
            }
        }

        dashboardEntries.sort(Comparator.comparing(DashboardEntry::getDate));

        return dashboardEntries;
    }

}
