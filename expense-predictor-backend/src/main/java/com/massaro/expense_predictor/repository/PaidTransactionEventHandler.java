package com.massaro.expense_predictor.repository;

import com.massaro.expense_predictor.model.Account;
import com.massaro.expense_predictor.model.CustomRecurringTransaction;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.stereotype.Component;

@Component
@RepositoryEventHandler
public class PaidTransactionEventHandler {

    private final AccountRepository accountRepository;

    public PaidTransactionEventHandler(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @HandleAfterCreate
    public void afterCreate(CustomRecurringTransaction customRecurringTransaction) {
        if (customRecurringTransaction.isPaid()) {
            Account account = customRecurringTransaction.getParentRecurringTransaction().getAccount();
            account.setBalance(account.getBalance().add(customRecurringTransaction.getAmount()));
            accountRepository.save(account);
        }
    }
}
