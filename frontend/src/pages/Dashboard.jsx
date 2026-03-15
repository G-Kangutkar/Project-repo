import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')

    axios.get('http://localhost:6800/api/account/balance', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setBalance(res.data.data?.balance))
      .catch(err => setError(err.response?.data?.error || err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ maxWidth: 500, margin: '60px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif' }}>

   
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 14, color: '#6b7280' }}>{user?.name || user?.email}</span>
          <button onClick={handleLogout} style={{ fontSize: 13, padding: '6px 12px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

     
      <div style={{ background: '#1d4ed8', color: '#fff', borderRadius: 12, padding: '28px 24px', marginBottom: 24, textAlign: 'center' }}>
        <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 8 }}>Current Balance</p>
        {loading ? (
          <p style={{ fontSize: 32, fontWeight: 700 }}>Loading…</p>
        ) : error ? (
          <p style={{ color: '#fca5a5' }}>⚠ {error}</p>
        ) : (
          <p style={{ fontSize: 40, fontWeight: 700 }}>
            ₹{Number(balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        )}
      </div>

      
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={() => navigate('/send')}
          style={{ flex: 1, padding: '14px', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
        >
          Send Money
        </button>
        <button
          onClick={() => navigate('/statement')}
          style={{ flex: 1, padding: '14px', background: '#fff', color: '#1d4ed8', border: '2px solid #1d4ed8', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
        >
          View Statement
        </button>
      </div>

    </div>
  )
}