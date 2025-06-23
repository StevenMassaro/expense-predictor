package com.massaro.expense_predictor.repository;

import com.massaro.expense_predictor.model.SingleTransaction;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(collectionResourceRel = "single-transactions", path = "single-transactions")
public interface SingleTransactionRepository extends ListCrudRepository<SingleTransaction, Long>, PagingAndSortingRepository<SingleTransaction, Long> {
    List<SingleTransaction> findAllByPaid(boolean paid);
}
