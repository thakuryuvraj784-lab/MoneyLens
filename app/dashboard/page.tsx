'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../components/Navbar'
import { Toaster, toast } from 'sonner'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart
} from 'recharts'
import { supabase } from '../../lib/supabase'

interface User {
  id: string
  name: string
  email: string
}

interface Transaction {
  id: string
  user_id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  note: string
  date: string
  created_at: string
}

interface Budget {
  id: string
  user_id: string
  category: string
  monthly_limit: number
}

const CATEGORIES = [
  'Food',
  'Transport',
  'Rent',
  'Salary',
  'Entertainment',
  'Health',
  'Education',
  'Other'
]

const COLORS = ['#00C2FF', '#00FF88', '#FFD700', '#FF6B6B', '#9B59B6', '#FF9800', '#E91E63', '#795548']

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [dateRange, setDateRange] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly')
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: 'Food',
    note: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [budgetForm, setBudgetForm] = useState({
    category: 'Food',
    monthly_limit: ''
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    fetchTransactions(parsedUser.id)
    fetchBudgets(parsedUser.id)
    setLoading(false)
  }, [router])

  const fetchTransactions = async (userId: string) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (error) {
      toast.error('Failed to load transactions')
      return
    }

    setTransactions(data || [])
  }

  const fetchBudgets = async (userId: string) => {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Failed to load budgets:', error)
      return
    }

    setBudgets(data || [])
  }

  const handleBudgetSubmit = async () => {
    if (!budgetForm.monthly_limit || parseFloat(budgetForm.monthly_limit) <= 0) {
      toast.error('Please enter a valid budget amount')
      return
    }

    const existingBudget = budgets.find(b => b.category === budgetForm.category)
    const budgetData = {
      user_id: user?.id,
      category: budgetForm.category,
      monthly_limit: parseFloat(budgetForm.monthly_limit)
    }

    if (existingBudget) {
      const { error } = await supabase
        .from('budgets')
        .update({ monthly_limit: budgetData.monthly_limit })
        .eq('id', existingBudget.id)

      if (error) {
        toast.error('Failed to update budget')
        return
      }
      toast.success('Budget updated!')
    } else {
      const { error } = await supabase
        .from('budgets')
        .insert([budgetData])

      if (error) {
        toast.error('Failed to set budget')
        return
      }
      toast.success('Budget set!')
    }

    setShowBudgetModal(false)
    setBudgetForm({ category: 'Food', monthly_limit: '' })
    fetchBudgets(user?.id || '')
  }

  const getCategorySpending = (category: string) => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    return transactions
      .filter(t =>
        t.type === 'expense' &&
        t.category === category &&
        new Date(t.date).getMonth() === currentMonth &&
        new Date(t.date).getFullYear() === currentYear
      )
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const getBudgetProgressColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100
    if (percentage >= 90) return '#F44336'
    if (percentage >= 70) return '#FF9800'
    return '#4CAF50'
  }

  const handleSubmit = async () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    const transactionData = {
      user_id: user?.id,
      type: formData.type,
      amount: parseFloat(formData.amount),
      category: formData.category,
      note: formData.note,
      date: formData.date
    }

    if (editingTransaction) {
      const { error } = await supabase
        .from('transactions')
        .update(transactionData)
        .eq('id', editingTransaction.id)

      if (error) {
        toast.error('Failed to update transaction')
        return
      }
      toast.success('Transaction updated!')
    } else {
      const { error } = await supabase
        .from('transactions')
        .insert([transactionData])

      if (error) {
        toast.error('Failed to add transaction')
        return
      }
      toast.success('Transaction added!')
    }

    setShowModal(false)
    setEditingTransaction(null)
    setFormData({
      type: 'expense',
      amount: '',
      category: 'Food',
      note: '',
      date: new Date().toISOString().split('T')[0]
    })
    fetchTransactions(user?.id || '')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this transaction?')) return

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Failed to delete transaction')
      return
    }

    toast.success('Transaction deleted!')
    fetchTransactions(user?.id || '')
  }

  const openEditModal = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      category: transaction.category,
      note: transaction.note,
      date: transaction.date.split('T')[0]
    })
    setShowModal(true)
  }

  const openAddModal = () => {
    setEditingTransaction(null)
    setFormData({
      type: 'expense',
      amount: '',
      category: 'Food',
      note: '',
      date: new Date().toISOString().split('T')[0]
    })
    setShowModal(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const exportToCSV = () => {
    if (transactions.length === 0) {
      toast.error('No transactions to export')
      return
    }

    const headers = ['Date', 'Type', 'Category', 'Note', 'Amount']
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        t.type,
        t.category,
        `"${t.note || ''}"`,
        t.type === 'income' ? t.amount : -t.amount
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('Transactions exported!')
  }

  // Calculate finance stats
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const netBalance = totalIncome - totalExpenses

  // Prepare chart data
  const monthlyData = transactions.reduce((acc: any, t) => {
    const month = new Date(t.date).toLocaleString('default', { month: 'short' })
    if (!acc[month]) acc[month] = { month, income: 0, expense: 0 }
    if (t.type === 'income') acc[month].income += t.amount
    else acc[month].expense += t.amount
    return acc
  }, {})

  const chartData = Object.values(monthlyData)

  // Category data for pie chart
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any, t) => {
      if (!acc[t.category]) acc[t.category] = 0
      acc[t.category] += t.amount
      return acc
    }, {})

  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }))

  if (loading) {
    return (
      <main style={{
        minHeight: '100vh',
        backgroundColor: '#0A0E1A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ color: '#00C2FF', fontSize: '16px' }}>Loading...</p>
      </main>
    )
  }

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0A0E1A',
      fontFamily: 'sans-serif',
      padding: '100px 40px 60px',
      boxSizing: 'border-box'
    }}>
      <Toaster position="top-right" theme="dark" />
      <Navbar />

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <p style={{
              color: '#00C2FF',
              letterSpacing: '4px',
              fontSize: '12px',
              textTransform: 'uppercase',
              margin: '0 0 8px'
            }}>
              Dashboard
            </p>
            <h1 style={{
              color: 'white',
              fontSize: '36px',
              fontWeight: '800',
              margin: 0
            }}>
              Welcome back, {user?.name}! 👋
            </h1>
            <p style={{
              color: '#8892A4',
              fontSize: '14px',
              margin: '8px 0 0'
            }}>
              {user?.email}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={exportToCSV}
              style={{
                backgroundColor: 'transparent',
                color: '#00C2FF',
                border: '1px solid #00C2FF',
                padding: '10px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                letterSpacing: '1px'
              }}
            >
              Export CSV
            </button>

            <button
              onClick={handleLogout}
              style={{
                backgroundColor: 'transparent',
                color: '#FF6B6B',
                border: '1px solid #FF6B6B',
                padding: '10px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                letterSpacing: '1px'
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Finance Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            backgroundColor: '#111827',
            border: '1px solid rgba(0, 194, 255, 0.3)',
            borderRadius: '12px',
            padding: '28px',
            textAlign: 'center'
          }}>
            <p style={{
              color: '#00C2FF',
              fontSize: '36px',
              fontWeight: '800',
              margin: '0 0 8px'
            }}>
              ₹{netBalance.toLocaleString()}
            </p>
            <p style={{
              color: '#8892A4',
              fontSize: '13px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              margin: 0
            }}>
              Net Balance
            </p>
          </div>

          <div style={{
            backgroundColor: '#111827',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: '12px',
            padding: '28px',
            textAlign: 'center'
          }}>
            <p style={{
              color: '#4CAF50',
              fontSize: '32px',
              fontWeight: '800',
              margin: '0 0 8px'
            }}>
              +₹{totalIncome.toLocaleString()}
            </p>
            <p style={{
              color: '#8892A4',
              fontSize: '13px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              margin: 0
            }}>
              Total Income
            </p>
          </div>

          <div style={{
            backgroundColor: '#111827',
            border: '1px solid rgba(244, 67, 54, 0.3)',
            borderRadius: '12px',
            padding: '28px',
            textAlign: 'center'
          }}>
            <p style={{
              color: '#F44336',
              fontSize: '32px',
              fontWeight: '800',
              margin: '0 0 8px'
            }}>
              -₹{totalExpenses.toLocaleString()}
            </p>
            <p style={{
              color: '#8892A4',
              fontSize: '13px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              margin: 0
            }}>
              Total Expenses
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {/* Income vs Expenses Chart */}
          <div style={{
            backgroundColor: '#111827',
            border: '1px solid rgba(0, 194, 255, 0.15)',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <h3 style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '700',
              margin: '0 0 20px'
            }}>
              Income vs Expenses
            </h3>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2332" />
                  <XAxis dataKey="month" stroke="#8892A4" />
                  <YAxis stroke="#8892A4" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#161b22',
                      border: '1px solid rgba(0, 194, 255, 0.3)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="income" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="#F44336" radius={[4, 4, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Breakdown */}
          <div style={{
            backgroundColor: '#111827',
            border: '1px solid rgba(0, 194, 255, 0.15)',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <h3 style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '700',
              margin: '0 0 20px'
            }}>
              Spending by Category
            </h3>
            <div style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#161b22',
                      border: '1px solid rgba(0, 194, 255, 0.3)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Transaction Manager */}
        <div style={{
          backgroundColor: '#111827',
          border: '1px solid rgba(0, 194, 255, 0.15)',
          borderRadius: '12px',
          padding: '28px',
          marginBottom: '40px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <h2 style={{
              color: 'white',
              fontSize: '20px',
              fontWeight: '700',
              margin: 0
            }}>
              Transactions
            </h2>

            <button
              onClick={openAddModal}
              style={{
                backgroundColor: '#00C2FF',
                color: '#0A0E1A',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              + Add Transaction
            </button>
          </div>

          {/* Transactions Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0, 194, 255, 0.1)' }}>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#8892A4', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#8892A4', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Category</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#8892A4', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Note</th>
                  <th style={{ textAlign: 'right', padding: '12px', color: '#8892A4', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Amount</th>
                  <th style={{ textAlign: 'center', padding: '12px', color: '#8892A4', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#8892A4' }}>
                      No transactions yet. Add your first transaction!
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id} style={{ borderBottom: '1px solid rgba(0, 194, 255, 0.05)' }}>
                      <td style={{ padding: '12px', color: 'white', fontSize: '14px' }}>
                        {new Date(t.date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          backgroundColor: 'rgba(0, 194, 255, 0.1)',
                          color: '#00C2FF',
                          fontSize: '12px',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: '1px solid rgba(0, 194, 255, 0.2)'
                        }}>
                          {t.category}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: '#8892A4', fontSize: '14px' }}>
                        {t.note || '-'}
                      </td>
                      <td style={{
                        padding: '12px',
                        textAlign: 'right',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: t.type === 'income' ? '#4CAF50' : '#F44336'
                      }}>
                        {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button
                          onClick={() => openEditModal(t)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#00C2FF',
                            cursor: 'pointer',
                            marginRight: '12px',
                            fontSize: '16px'
                          }}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#FF6B6B',
                            cursor: 'pointer',
                            fontSize: '16px'
                          }}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Budget Goals */}
        <div style={{
          backgroundColor: '#111827',
          border: '1px solid rgba(0, 194, 255, 0.15)',
          borderRadius: '12px',
          padding: '28px',
          marginBottom: '40px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <h2 style={{
              color: 'white',
              fontSize: '20px',
              fontWeight: '700',
              margin: 0
            }}>
              Budget Goals
            </h2>

            <button
              onClick={() => setShowBudgetModal(true)}
              style={{
                backgroundColor: 'transparent',
                color: '#00C2FF',
                border: '1px solid #00C2FF',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                letterSpacing: '1px'
              }}
            >
              + Set Budget
            </button>
          </div>

          {budgets.length === 0 ? (
            <p style={{ color: '#8892A4', fontSize: '14px' }}>
              No budgets set yet. Click "Set Budget" to create spending limits for categories!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {budgets.map((budget) => {
                const spent = getCategorySpending(budget.category)
                const percentage = Math.min((spent / budget.monthly_limit) * 100, 100)
                const progressColor = getBudgetProgressColor(spent, budget.monthly_limit)
                const isOverBudget = spent >= budget.monthly_limit

                if (percentage >= 90 && percentage < 100 && !isOverBudget) {
                  toast.warning(`You're at ${Math.round(percentage)}% of your ${budget.category} budget!`, { id: `budget-${budget.id}` })
                } else if (isOverBudget) {
                  toast.error(`You've exceeded your ${budget.category} budget!`, { id: `budget-${budget.id}` })
                }

                return (
                  <div key={budget.id} style={{
                    backgroundColor: '#0A0E1A',
                    border: '1px solid rgba(0, 194, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '16px 20px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600'
                        }}>
                          {budget.category}
                        </span>
                        {isOverBudget && (
                          <span style={{
                            backgroundColor: '#F4433620',
                            color: '#F44336',
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontWeight: '600'
                          }}>
                            Over Budget!
                          </span>
                        )}
                      </div>
                      <span style={{ color: '#8892A4', fontSize: '14px' }}>
                        ₹{spent.toLocaleString()} / ₹{budget.monthly_limit.toLocaleString()}
                      </span>
                    </div>

                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#1a2332',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor: progressColor,
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>

                    <p style={{
                      color: progressColor,
                      fontSize: '12px',
                      margin: '8px 0 0',
                      fontWeight: '600'
                    }}>
                      {Math.round(percentage)}% used
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Registered Events (existing) */}
        <div style={{
          backgroundColor: '#111827',
          border: '1px solid rgba(0, 194, 255, 0.15)',
          borderRadius: '12px',
          padding: '28px'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '20px',
            fontWeight: '700',
            margin: '0 0 20px'
          }}>
            Your Registered Events
          </h2>
          <p style={{ color: '#8892A4', fontSize: '14px' }}>
            No events registered yet. Browse events to join!
          </p>
        </div>
      </div>

      {/* Add/Edit Transaction Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: '#111827',
            border: '1px solid rgba(0, 194, 255, 0.3)',
            borderRadius: '16px',
            padding: '32px',
            width: '100%',
            maxWidth: '450px',
            margin: '20px'
          }}>
            <h2 style={{
              color: 'white',
              fontSize: '24px',
              fontWeight: '700',
              margin: '0 0 24px'
            }}>
              {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </h2>

            {/* Type Toggle */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#8892A4', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>
                Type
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['income', 'expense'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFormData({ ...formData, type: type as 'income' | 'expense' })}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: formData.type === type ? (type === 'income' ? '#4CAF50' : '#F44336') : '#0A0E1A',
                      color: formData.type === type ? 'white' : '#8892A4',
                      border: `1px solid ${formData.type === type ? (type === 'income' ? '#4CAF50' : '#F44336') : 'rgba(0, 194, 255, 0.2)'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      fontSize: '13px'
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#8892A4', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>
                Amount (₹)
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#0A0E1A',
                  border: '1px solid rgba(0, 194, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Category */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#8892A4', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#0A0E1A',
                  border: '1px solid rgba(0, 194, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  cursor: 'pointer'
                }}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat} style={{ backgroundColor: '#161b22' }}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#8892A4', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#0A0E1A',
                  border: '1px solid rgba(0, 194, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Note */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: '#8892A4', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>
                Note (Optional)
              </label>
              <input
                type="text"
                placeholder="Add a note..."
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#0A0E1A',
                  border: '1px solid rgba(0, 194, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: 'transparent',
                  color: '#8892A4',
                  border: '1px solid rgba(139, 148, 158, 0.3)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: '#00C2FF',
                  color: '#0A0E1A',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {editingTransaction ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Budget Modal */}
      {showBudgetModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: '#111827',
            border: '1px solid rgba(0, 194, 255, 0.3)',
            borderRadius: '16px',
            padding: '32px',
            width: '100%',
            maxWidth: '400px',
            margin: '20px'
          }}>
            <h2 style={{
              color: 'white',
              fontSize: '24px',
              fontWeight: '700',
              margin: '0 0 24px'
            }}>
              Set Budget Limit
            </h2>

            {/* Category */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#8892A4', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>
                Category
              </label>
              <select
                value={budgetForm.category}
                onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#0A0E1A',
                  border: '1px solid rgba(0, 194, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  cursor: 'pointer'
                }}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat} style={{ backgroundColor: '#161b22' }}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Monthly Limit */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: '#8892A4', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>
                Monthly Limit (₹)
              </label>
              <input
                type="number"
                placeholder="5000"
                value={budgetForm.monthly_limit}
                onChange={(e) => setBudgetForm({ ...budgetForm, monthly_limit: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#0A0E1A',
                  border: '1px solid rgba(0, 194, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowBudgetModal(false)}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: 'transparent',
                  color: '#8892A4',
                  border: '1px solid rgba(139, 148, 158, 0.3)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleBudgetSubmit}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: '#00C2FF',
                  color: '#0A0E1A',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Set Budget
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
