package com.expensetracker.expense;

import java.util.List;

public interface ExpenseService {
    ExpenseResponse create(ExpenseRequest request);

    List<ExpenseResponse> findAll();

    ExpenseResponse findById(Long id);

    ExpenseResponse update(Long id, ExpenseRequest request);

    void delete(Long id);

    List<ExpenseResponse> findByCategory(String category);
}
