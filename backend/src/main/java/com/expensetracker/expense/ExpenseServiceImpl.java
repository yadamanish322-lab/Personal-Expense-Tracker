package com.expensetracker.expense;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ExpenseServiceImpl implements ExpenseService {
    private final ExpenseRepository repository;

    public ExpenseServiceImpl(ExpenseRepository repository) {
        this.repository = repository;
    }

    @Override
    public ExpenseResponse create(ExpenseRequest request) {
        Expense expense = new Expense(
                request.title().trim(),
                request.amount(),
                request.category(),
                request.date()
        );
        return ExpenseResponse.from(repository.save(expense));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponse> findAll() {
        return repository.findAllByOrderByDateDescIdDesc()
                .stream()
                .map(ExpenseResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ExpenseResponse findById(Long id) {
        return ExpenseResponse.from(getExpense(id));
    }

    @Override
    public ExpenseResponse update(Long id, ExpenseRequest request) {
        Expense expense = getExpense(id);
        expense.setTitle(request.title().trim());
        expense.setAmount(request.amount());
        expense.setCategory(request.category());
        expense.setDate(request.date());
        return ExpenseResponse.from(repository.save(expense));
    }

    @Override
    public void delete(Long id) {
        repository.delete(getExpense(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponse> findByCategory(String category) {
        return repository.findByCategoryOrderByDateDescIdDesc(category)
                .stream()
                .map(ExpenseResponse::from)
                .toList();
    }

    private Expense getExpense(Long id) {
        return repository.findById(id).orElseThrow(() -> new ExpenseNotFoundException(id));
    }
}
