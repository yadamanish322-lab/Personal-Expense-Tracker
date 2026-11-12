package com.expensetracker.expense;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.expensetracker.exception.GlobalExceptionHandler;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.context.annotation.Import;

@WebMvcTest(ExpenseController.class)
@Import(GlobalExceptionHandler.class)
class ExpenseControllerTest {
    private static final ExpenseResponse EXPENSE = new ExpenseResponse(
            7L,
            "Lunch",
            new BigDecimal("12.50"),
            "Food",
            LocalDate.of(2026, 10, 31)
    );

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ExpenseService service;

    @Test
    void createsExpenseWithCreatedStatus() throws Exception {
        when(service.create(any(ExpenseRequest.class))).thenReturn(EXPENSE);

        mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Lunch",
                                  "amount": 12.50,
                                  "category": "Food",
                                  "date": "2026-10-31"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(7))
                .andExpect(jsonPath("$.amount").value(12.5))
                .andExpect(jsonPath("$.category").value("Food"));
    }

    @Test
    void rejectsBlankTitleAndNonPositiveAmount() throws Exception {
        mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": " ",
                                  "amount": 0,
                                  "category": "Food",
                                  "date": "2026-10-31"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.validationErrors.title").exists())
                .andExpect(jsonPath("$.validationErrors.amount").exists());
    }

    @Test
    void rejectsUnsupportedCategory() throws Exception {
        mockMvc.perform(post("/api/expenses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Lunch",
                                  "amount": 12.50,
                                  "category": "Utilities",
                                  "date": "2026-10-31"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.validationErrors.category").exists());
    }

    @Test
    void listsExpenses() throws Exception {
        when(service.findAll()).thenReturn(List.of(EXPENSE));

        mockMvc.perform(get("/api/expenses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Lunch"));
    }

    @Test
    void getsExpenseById() throws Exception {
        when(service.findById(7L)).thenReturn(EXPENSE);

        mockMvc.perform(get("/api/expenses/7"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(7));
    }

    @Test
    void returnsNotFoundForMissingExpense() throws Exception {
        when(service.findById(99L)).thenThrow(new ExpenseNotFoundException(99L));

        mockMvc.perform(get("/api/expenses/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Expense with ID 99 was not found"));
    }

    @Test
    void updatesExpense() throws Exception {
        when(service.update(any(Long.class), any(ExpenseRequest.class))).thenReturn(EXPENSE);

        mockMvc.perform(put("/api/expenses/7")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Lunch",
                                  "amount": 12.50,
                                  "category": "Food",
                                  "date": "2026-10-31"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(7));
    }

    @Test
    void deletesExpense() throws Exception {
        doNothing().when(service).delete(7L);

        mockMvc.perform(delete("/api/expenses/7"))
                .andExpect(status().isOk());

        verify(service).delete(7L);
    }

    @Test
    void filtersByCategory() throws Exception {
        when(service.findByCategory("Food")).thenReturn(List.of(EXPENSE));

        mockMvc.perform(get("/api/expenses/category/Food"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].category").value("Food"));
    }

    @Test
    void rejectsUnsupportedCategoryFilter() throws Exception {
        mockMvc.perform(get("/api/expenses/category/Utilities"))
                .andExpect(status().isBadRequest());
    }
}
