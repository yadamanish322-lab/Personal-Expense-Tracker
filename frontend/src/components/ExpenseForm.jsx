import { useState } from 'react'
import { CalendarDays, CirclePlus, X } from 'lucide-react'

const categories = ['Food', 'Travel', 'Shopping', 'Other']

function today() {
  const now = new Date()
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  return localDate.toISOString().slice(0, 10)
}

function formValues(expense) {
  return expense
    ? {
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
      }
    : { title: '', amount: '', category: 'Food', date: today() }
}

export default function ExpenseForm({
  expense,
  isSaving,
  onCancel,
  onSubmit,
}) {
  const [values, setValues] = useState(() => formValues(expense))
  const [formError, setFormError] = useState('')

  function updateField(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setFormError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const amount = Number(values.amount)

    if (!values.title.trim()) {
      setFormError('Add a title for this expense.')
      return
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError('Enter an amount greater than zero.')
      return
    }
    if (!categories.includes(values.category)) {
      setFormError('Choose a valid category.')
      return
    }
    if (!values.date) {
      setFormError('Choose the date of this expense.')
      return
    }

    try {
      await onSubmit({ ...values, title: values.title.trim(), amount })
      if (!expense) setValues(formValues(null))
    } catch {
      // The parent displays the API error.
    }
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label className="field field-title">
          <span>Expense title</span>
          <input
            autoComplete="off"
            maxLength="120"
            name="title"
            onChange={updateField}
            placeholder="e.g. Lunch with friends"
            required
            value={values.title}
          />
        </label>

        <label className="field">
          <span>Amount</span>
          <div className="input-with-prefix">
            <span aria-hidden="true">₹</span>
            <input
              min="0.01"
              name="amount"
              onChange={updateField}
              placeholder="0.00"
              required
              step="0.01"
              type="number"
              value={values.amount}
            />
          </div>
        </label>

        <label className="field">
          <span>Category</span>
          <select
            name="category"
            onChange={updateField}
            required
            value={values.category}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Expense date</span>
          <div className="input-with-icon">
            <input
              max={today()}
              name="date"
              onChange={updateField}
              required
              type="date"
              value={values.date}
            />
            <CalendarDays aria-hidden="true" size={17} />
          </div>
        </label>
      </div>

      {formError && (
        <p className="form-error" role="alert">
          {formError}
        </p>
      )}

      <div className="form-actions">
        {expense && (
          <button
            className="button button-quiet"
            onClick={onCancel}
            type="button"
          >
            <X size={16} />
            Cancel
          </button>
        )}
        <button className="button button-primary" disabled={isSaving} type="submit">
          <CirclePlus size={17} />
          {isSaving ? 'Saving…' : expense ? 'Save changes' : 'Add expense'}
        </button>
      </div>
    </form>
  )
}
