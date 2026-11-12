package com.expensetracker.expense;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseRequest(
        @NotBlank(message = "Title must not be blank")
        @Size(max = 120, message = "Title must be 120 characters or fewer")
        String title,

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.00", inclusive = false, message = "Amount must be greater than zero")
        @Digits(integer = 10, fraction = 2, message = "Amount can have up to 10 digits and 2 decimal places")
        BigDecimal amount,

        @NotBlank(message = "Category is required")
        @Pattern(regexp = "Food|Travel|Shopping|Other", message = "Category must be Food, Travel, Shopping, or Other")
        String category,

        @NotNull(message = "Date is required")
        LocalDate date
) {
}
