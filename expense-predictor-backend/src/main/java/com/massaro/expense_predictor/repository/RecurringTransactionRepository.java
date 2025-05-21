package com.massaro.expense_predictor.repository;

import com.massaro.expense_predictor.model.RecurringTransaction;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "recurring-transactions", path = "recurring-transactions")
public interface RecurringTransactionRepository extends CrudRepository<RecurringTransaction, Long> {
}
