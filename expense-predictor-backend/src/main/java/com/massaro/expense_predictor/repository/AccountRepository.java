package com.massaro.expense_predictor.repository;

import com.massaro.expense_predictor.model.Account;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "accounts", path = "accounts")
public interface AccountRepository extends ListCrudRepository<Account, Long>, PagingAndSortingRepository<Account, Long> {
}
