import { ArrowDownRight, Pencil, Trash2 } from 'lucide-react'
import { formatCurrency, formatDate } from '../utils/formatters'

const categoryColors = {
  Food: 'coral',
  Travel: 'blue',
  Shopping: 'purple',
  Other: 'green',
}

export default function ExpenseTable({
  expenses,
  isLoading,
  onDelete,
  onEdit,
}) {
  if (isLoading) {
    return (
      <div className="table-state" role="status">
        <span className="spinner" />
        Loading your expenses…
      </div>
    )
  }

  if (expenses.length === 0) {
    return (
      <div className="table-state empty-state">
        <div className="empty-icon">
          <ArrowDownRight size={22} />
        </div>
        <strong>No expenses found</strong>
        <span>Try another category or add your first expense.</span>
      </div>
    )
  }

  return (
    <div className="table-scroll">
      <table className="expense-table">
        <thead>
          <tr>
            <th scope="col">Expense</th>
            <th scope="col">Category</th>
            <th scope="col">Date</th>
            <th className="amount-cell" scope="col">Amount</th>
            <th className="actions-cell" scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>
                <div className="expense-name">
                  <span className={`expense-mark ${categoryColors[expense.category] || 'green'}`}>
                    {expense.title.charAt(0).toUpperCase()}
                  </span>
                  <span>
                    <strong>{expense.title}</strong>
                    <small>#{expense.id}</small>
                  </span>
                </div>
              </td>
              <td>
                <span className={`category-pill ${categoryColors[expense.category] || 'green'}`}>
                  {expense.category}
                </span>
              </td>
              <td className="date-cell">{formatDate(expense.date)}</td>
              <td className="amount-cell">
                <strong>{formatCurrency(expense.amount)}</strong>
              </td>
              <td className="actions-cell">
                <div className="row-actions">
                  <button
                    aria-label={`Edit ${expense.title}`}
                    className="icon-button"
                    onClick={() => onEdit(expense)}
                    title="Edit expense"
                    type="button"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    aria-label={`Delete ${expense.title}`}
                    className="icon-button danger-button"
                    onClick={() => onDelete(expense)}
                    title="Delete expense"
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
