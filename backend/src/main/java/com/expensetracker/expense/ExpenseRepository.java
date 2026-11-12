package com.expensetracker.expense;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findAllByOrderByDateDescIdDesc();

    List<Expense> findByCategoryOrderByDateDescIdDesc(String category);
}
