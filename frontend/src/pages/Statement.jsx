import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Statement() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    axios.get('http://localhost:6800/api/account/statement', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setTransactions(res.data.data || []))
      .catch(err => setError(err.response?.data?.error || err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ padding: '40px 20px', maxWidth: 900, margin: '0 auto' }}>


      <h2 style={{ marginBottom: 20 }}>Account Statement</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>⚠ {error}</p>}
      {!loading && transactions.length === 0 && <p>No transactions found.</p>}

      {!loading && transactions.length > 0 && (
        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>From</th>
              <th>To</th>
              
              
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id}>
                <td>{new Date(tx.date).toLocaleString('en-IN',{ day: '2-digit', month: 'short' })}</td>
                <td style={{color:tx.transaction_type==='credit'?'green':'red'}}>{tx.transaction_type}</td>
                <td>{tx.amount}</td>
                <td>{tx.sender?.name || '—'}</td>
                <td>{tx.receiver?.name || '—'}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  )
}

export default Statement