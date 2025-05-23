package com.massaro.expense_predictor.repository;

import com.massaro.expense_predictor.model.PaidTransaction;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "paid-transactions", path = "paid-transactions")
public interface PaidTransactionRepository extends ListCrudRepository<PaidTransaction, Long> {
}
