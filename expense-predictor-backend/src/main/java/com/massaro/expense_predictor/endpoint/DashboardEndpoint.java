package com.massaro.expense_predictor.endpoint;

import com.massaro.expense_predictor.model.*;
import com.massaro.expense_predictor.repository.RecurringTransactionRepository;
import com.massaro.expense_predictor.repository.SingleTransactionRepository;
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
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/dashboard")
public class DashboardEndpoint {

    private final RecurringTransactionRepository recurringTransactionRepository;
    private final SingleTransactionRepository singleTransactionRepository;

    public DashboardEndpoint(RecurringTransactionRepository recurringTransactionRepository,
                             SingleTransactionRepository singleTransactionRepository) {
        this.recurringTransactionRepository = recurringTransactionRepository;
        this.singleTransactionRepository = singleTransactionRepository;
    }

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
            List<CustomRecurringTransaction> customRecurringTransactions = recurringTransaction.getCustomRecurringTransactions();

            Set<LocalDate> paidDates = customRecurringTransactions.stream()
                    .filter(CustomRecurringTransaction::isPaid)
                    .map(CustomRecurringTransaction::getOriginalTransactionDate)
                    .collect(Collectors.toSet());

            Set<CustomRecurringTransaction> transactionOverrides = customRecurringTransactions.stream()
                    .filter(customRecurringTransaction -> !customRecurringTransaction.isPaid())
                    .collect(Collectors.toSet());

            LocalDate nextOccurrence;
            if (recurrence == Recurrence.monthly) {
                nextOccurrence = createdAt.toLocalDate().withDayOfMonth(Math.min(recurrenceDay, 28)); // fallback to 28 to avoid invalid dates
                while (!nextOccurrence.isAfter(oneYearFromNow.toLocalDate())) {
                    if (!paidDates.contains(nextOccurrence)) {
                        CustomRecurringTransaction customRecurringTransaction = getCustomRecurringTransaction(transactionOverrides, nextOccurrence, amount);
                        dashboardEntries.add(new DashboardEntry(
                                recurringTransaction.getId(),
                                null,
                                customRecurringTransaction == null ? null : customRecurringTransaction.getId(),
                                nextOccurrence,
                                description,
                                recurringTransaction.getAccount(),
                                customRecurringTransaction == null ? amount : customRecurringTransaction.getAmount()
                        ));
                    }
                    nextOccurrence = nextOccurrence.plusMonths(1).withDayOfMonth(Math.min(recurrenceDay, nextOccurrence.lengthOfMonth()));
                }
            } else if (recurrence == Recurrence.annually) {
                LocalDate createdDate = createdAt.toLocalDate();
                int year = createdDate.getYear();
                int month = createdDate.getMonthValue();
                nextOccurrence = LocalDate.of(year, month, Math.min(recurrenceDay, YearMonth.of(year, month).lengthOfMonth()));
                while (!nextOccurrence.isAfter(oneYearFromNow.toLocalDate())) {
                    if (!paidDates.contains(nextOccurrence)) {
                        CustomRecurringTransaction customRecurringTransaction = getCustomRecurringTransaction(transactionOverrides, nextOccurrence, amount);
                        dashboardEntries.add(new DashboardEntry(
                                recurringTransaction.getId(),
                                null,
                                customRecurringTransaction == null ? null : customRecurringTransaction.getId(),
                                nextOccurrence,
                                description,
                                recurringTransaction.getAccount(),
                                customRecurringTransaction == null ? amount : customRecurringTransaction.getAmount()
                        ));
                    }
                    year++;
                    int daysInMonth = YearMonth.of(year, month).lengthOfMonth();
                    nextOccurrence = LocalDate.of(year, month, Math.min(recurrenceDay, daysInMonth));
                }
            }
        }

        List<SingleTransaction> singleTransactions = singleTransactionRepository.findAll();
        dashboardEntries.addAll(singleTransactions.stream().map(st -> new DashboardEntry(
                null,
                st.getId(),
                null,
                st.getDate(),
                st.getName(),
                st.getAccount(),
                st.getAmount()
        )).toList());

        dashboardEntries.sort(Comparator.comparing(DashboardEntry::getDate));

        setBeforeAndAfterAmounts(dashboardEntries);

        return dashboardEntries;
    }

    private CustomRecurringTransaction getCustomRecurringTransaction(Set<CustomRecurringTransaction> transactionOverrides, LocalDate nextOccurrence, BigDecimal amount) {
        return transactionOverrides.stream().filter(
                to -> to.getOriginalTransactionDate().equals(nextOccurrence)
        ).findFirst().orElse(null);
    }

    private void setBeforeAndAfterAmounts(List<DashboardEntry> dashboardEntries) {
        for (DashboardEntry dashboardEntry : dashboardEntries) {
            Account account = dashboardEntry.getAccount();
            dashboardEntry.setBefore(account.getBalance());
            BigDecimal newBalance = account.getBalance().add(dashboardEntry.getAmount());
            dashboardEntry.setAfter(newBalance);
            account.setBalance(newBalance);
        }
    }

}
