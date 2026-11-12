import { useEffect, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  ChartNoAxesCombined,
  CircleHelp,
  Command,
  LayoutDashboard,
  Plus,
  ReceiptText,
  WalletCards,
} from 'lucide-react'
import ExpenseForm from './components/ExpenseForm'
import ExpenseTable from './components/ExpenseTable'
import {
  RecentExpenses,
  SpendingBreakdown,
  SummaryCards,
} from './components/DashboardSummary'
import { expenseApi, getApiErrorMessage } from './services/expenseApi'
import './App.css'

const categories = ['Food', 'Travel', 'Shopping', 'Other']

function App() {
  const [expenses, setExpenses] = useState([])
  const [category, setCategory] = useState('')
  const [refreshVersion, setRefreshVersion] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    let isCurrent = true

    expenseApi.getAll(category)
      .then((data) => {
        if (!isCurrent) return
        setExpenses(data)
        setNotice((current) => current?.type === 'error' ? null : current)
      })
      .catch((error) => {
        if (isCurrent) {
          setNotice({ type: 'error', text: getApiErrorMessage(error) })
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [category, refreshVersion])

  async function saveExpense(values) {
    setIsSaving(true)
    setNotice(null)
    try {
      if (editingExpense) {
        await expenseApi.update(editingExpense.id, values)
        setNotice({ type: 'success', text: 'Expense updated successfully.' })
        setEditingExpense(null)
      } else {
        await expenseApi.create(values)
        setNotice({ type: 'success', text: 'Expense added successfully.' })
      }
      setIsLoading(true)
      setRefreshVersion((version) => version + 1)
    } catch (error) {
      setNotice({ type: 'error', text: getApiErrorMessage(error) })
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteExpense(expense) {
    if (!window.confirm(`Delete "${expense.title}"? This cannot be undone.`)) {
      return
    }

    setNotice(null)
    try {
      await expenseApi.delete(expense.id)
      setNotice({ type: 'success', text: 'Expense deleted successfully.' })
      if (editingExpense?.id === expense.id) setEditingExpense(null)
      setIsLoading(true)
      setRefreshVersion((version) => version + 1)
    } catch (error) {
      setNotice({ type: 'error', text: getApiErrorMessage(error) })
    }
  }

  function handleCategoryChange(event) {
    setIsLoading(true)
    setCategory(event.target.value)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a aria-label="Pennywise home" className="brand" href="#overview">
          <span className="brand-mark">
            <WalletCards size={21} strokeWidth={2.2} />
          </span>
          <span>Pennywise<span className="brand-period">.</span></span>
        </a>

        <div className="workspace-label">WORKSPACE</div>
        <nav aria-label="Main navigation" className="sidebar-nav">
          <a className="nav-link active" href="#overview">
            <LayoutDashboard size={18} />
            Overview
          </a>
          <a className="nav-link" href="#transactions">
            <ReceiptText size={18} />
            Transactions
          </a>
          <a className="nav-link" href="#insights">
            <ChartNoAxesCombined size={18} />
            Insights
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-icon"><CircleHelp size={17} /></span>
            <strong>Stay on top of it</strong>
            <p>A little tracking goes a long way toward your goals.</p>
          </div>
          <div className="profile">
            <span className="profile-avatar">P</span>
            <span className="profile-label">
              <strong>Personal account</strong>
              <small>Expense workspace</small>
            </span>
            <Command className="profile-menu-icon" size={16} />
          </div>
        </div>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> Overview</div>
          <div className="topbar-right">
            <span className="today-label">
              <span className="status-dot" />
              Your finances, at a glance
            </span>
            <span aria-label="Profile" className="topbar-avatar">P</span>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <p className="eyebrow">PERSONAL FINANCE</p>
              <h1>Good things start with <span>awareness.</span></h1>
              <p className="welcome-copy">
                Keep your spending in view and make every rupee count.
              </p>
            </div>
            <a className="button button-primary hero-button" href="#add-expense">
              <Plus size={18} />
              Add expense
            </a>
          </section>

          {notice && (
            <div className={`notice ${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>
              <span className="notice-dot" />
              {notice.text}
              <button
                aria-label="Dismiss message"
                className="notice-close"
                onClick={() => setNotice(null)}
                type="button"
              >
                ×
              </button>
            </div>
          )}

          {isLoading && expenses.length === 0 ? (
            <div className="loading-dashboard" role="status">
              <span className="spinner" />
              Loading your dashboard…
            </div>
          ) : (
            <>
              <SummaryCards expenses={expenses} />

              <section className="insights-grid" id="insights">
                <SpendingBreakdown expenses={expenses} />
                <RecentExpenses expenses={expenses} />
              </section>
            </>
          )}

          <section className="panel transactions-panel" id="transactions">
            <div className="panel-heading transactions-heading">
              <div>
                <h2>All transactions</h2>
                <p>Every expense, all in one place</p>
              </div>
              <label className="filter-control">
                <span>Category</span>
                <select onChange={handleCategoryChange} value={category}>
                  <option value="">All categories</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>
            <ExpenseTable
              expenses={expenses}
              isLoading={isLoading}
              onDelete={deleteExpense}
              onEdit={(expense) => {
                setEditingExpense(expense)
                setNotice(null)
                document.getElementById('add-expense')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                })
              }}
            />
          </section>

          <section className="panel add-panel" id="add-expense">
            <div className="panel-heading add-heading">
              <div>
                <p className="eyebrow">QUICK ENTRY</p>
                <h2>{editingExpense ? 'Edit expense' : 'Add an expense'}</h2>
                <p>
                  {editingExpense
                    ? 'Update the details below and save your changes.'
                    : 'Capture it now. You can always edit the details later.'}
                </p>
              </div>
              <div className="add-icon">
                {editingExpense ? <ArrowUpRight size={21} /> : <ArrowDownRight size={21} />}
              </div>
            </div>
            <ExpenseForm
              expense={editingExpense}
              isSaving={isSaving}
              key={editingExpense?.id ?? 'new'}
              onCancel={() => setEditingExpense(null)}
              onSubmit={saveExpense}
            />
          </section>

          <footer className="page-footer">
            <span>Made for a clearer picture of your money.</span>
            <span><span className="status-dot" /> Data saved securely to your database</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App
