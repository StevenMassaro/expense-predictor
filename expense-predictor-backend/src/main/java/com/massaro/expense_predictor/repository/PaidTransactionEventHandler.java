package com.massaro.expense_predictor.repository;

import com.massaro.expense_predictor.model.Account;
import com.massaro.expense_predictor.model.PaidTransaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
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
    public void afterCreate(PaidTransaction paidTransaction) {
        Account account = paidTransaction.getParentRecurringTransaction().getAccount();
        account.setBalance(account.getBalance().add(paidTransaction.getAmount()));
        accountRepository.save(account);
    }
}
