package com.massaro.expense_predictor.repository;

import com.massaro.expense_predictor.model.CustomRecurringTransaction;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "custom-recurring-transactions", path = "custom-recurring-transactions")
public interface CustomRecurringTransactionRepository extends ListCrudRepository<CustomRecurringTransaction, Long>, PagingAndSortingRepository<CustomRecurringTransaction, Long> {
}
