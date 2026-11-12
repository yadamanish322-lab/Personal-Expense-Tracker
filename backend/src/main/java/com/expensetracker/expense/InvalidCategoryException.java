package com.expensetracker.expense;

public class InvalidCategoryException extends RuntimeException {
    public InvalidCategoryException(String category) {
        super("Unsupported category: " + category);
    }
}
