package com.massaro.expense_predictor.repository;

import com.massaro.expense_predictor.model.Account;
import com.massaro.expense_predictor.model.CustomRecurringTransaction;
import com.massaro.expense_predictor.model.SingleTransaction;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.HandleAfterSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.stereotype.Component;

@Component
@RepositoryEventHandler
public class SingleTransactionEventHandler {

    private final AccountRepository accountRepository;

    public SingleTransactionEventHandler(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @HandleAfterSave
    public void afterSave(SingleTransaction singleTransaction) {
        if (singleTransaction.isPaid()) {
            Account account = singleTransaction.getAccount();
            account.setBalance(account.getBalance().add(singleTransaction.getAmount()));
            accountRepository.save(account);
        }
    }
}
