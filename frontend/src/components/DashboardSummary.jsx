import { ArrowDownRight, ArrowUpRight, CircleDollarSign, ReceiptText } from 'lucide-react'
import { formatCurrency, formatDate } from '../utils/formatters'

const categoryColors = {
  Food: 'coral',
  Travel: 'blue',
  Shopping: 'purple',
  Other: 'green',
}

export function SummaryCards({ expenses }) {
  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
  const latest = [...expenses].sort((a, b) => b.date.localeCompare(a.date))[0]

  return (
    <div className="summary-grid">
      <article className="summary-card summary-primary">
        <div className="summary-topline">
          <span>Total expenses</span>
          <span className="summary-icon">
            <CircleDollarSign size={19} />
          </span>
        </div>
        <strong className="summary-value">{formatCurrency(total)}</strong>
        <span className="summary-caption">Across all recorded transactions</span>
      </article>
      <article className="summary-card">
        <div className="summary-topline">
          <span>Transactions</span>
          <span className="summary-icon pale-icon">
            <ReceiptText size={19} />
          </span>
        </div>
        <strong className="summary-value">{expenses.length}</strong>
        <span className="summary-caption">Expense{expenses.length === 1 ? '' : 's'} recorded</span>
      </article>
      <article className="summary-card">
        <div className="summary-topline">
          <span>Most recent</span>
          <span className="summary-icon pale-icon">
            <ArrowDownRight size={19} />
          </span>
        </div>
        <strong className="summary-value summary-recent">
          {latest ? formatCurrency(latest.amount) : formatCurrency(0)}
        </strong>
        <span className="summary-caption">
          {latest ? `${latest.title} · ${formatDate(latest.date)}` : 'No expenses yet'}
        </span>
      </article>
    </div>
  )
}

export function SpendingBreakdown({ expenses }) {
  const totals = expenses.reduce((categories, expense) => {
    categories[expense.category] =
      (categories[expense.category] || 0) + Number(expense.amount)
    return categories
  }, {})
  const grandTotal = Object.values(totals).reduce((sum, amount) => sum + amount, 0)
  const breakdown = ['Food', 'Travel', 'Shopping', 'Other']
    .map((category) => ({
      category,
      amount: totals[category] || 0,
      percentage: grandTotal ? ((totals[category] || 0) / grandTotal) * 100 : 0,
    }))
    .filter((item) => item.amount > 0)

  return (
    <section className="panel breakdown-panel">
      <div className="panel-heading">
        <div>
          <h2>Spending by category</h2>
          <p>See where your money goes</p>
        </div>
        <span className="heading-decoration">
          <ArrowUpRight size={17} />
        </span>
      </div>
      {breakdown.length === 0 ? (
        <p className="chart-empty">Your category breakdown will appear here.</p>
      ) : (
        <div className="breakdown-list">
          {breakdown.map(({ category, amount, percentage }) => (
            <div className="breakdown-item" key={category}>
              <div className="breakdown-label">
                <span>
                  <i className={`legend-dot ${categoryColors[category]}`} />
                  {category}
                </span>
                <strong>{formatCurrency(amount)}</strong>
              </div>
              <div
                aria-label={`${category}: ${percentage.toFixed(0)} percent`}
                className="progress-track"
                role="img"
              >
                <span
                  className={`progress-fill ${categoryColors[category]}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export function RecentExpenses({ expenses }) {
  const recent = [...expenses]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
    .slice(0, 4)

  return (
    <section className="panel recent-panel">
      <div className="panel-heading">
        <div>
          <h2>Recent expenses</h2>
          <p>Your latest activity</p>
        </div>
      </div>
      {recent.length === 0 ? (
        <p className="chart-empty">Your recent expenses will show up here.</p>
      ) : (
        <div className="recent-list">
          {recent.map((expense) => (
            <div className="recent-item" key={expense.id}>
              <span className={`expense-mark ${categoryColors[expense.category] || 'green'}`}>
                {expense.title.charAt(0).toUpperCase()}
              </span>
              <span className="recent-description">
                <strong>{expense.title}</strong>
                <small>{expense.category} · {formatDate(expense.date)}</small>
              </span>
              <strong className="recent-amount">{formatCurrency(expense.amount)}</strong>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
