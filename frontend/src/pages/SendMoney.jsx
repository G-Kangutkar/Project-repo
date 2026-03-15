import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function SendMoney() {
  const navigate = useNavigate()

  const [inputData, setInputData] = useState({ receiver_email: '', amount: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleInputs = (e) => {
    const { name, value } = e.target
    setInputData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        'http://localhost:6800/api/account/transfer',
        inputData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSuccess(response.data.message)
      setInputData({ receiver_email: '', amount: '' })
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '60px auto', padding: '0 20px'}}>


      <h2 style={{ marginBottom: 24 }}>Send Money</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        <div>
          <label style={{ display: 'block', marginBottom: 5, fontSize: 14 }}>Receiver Email</label>
          <input
            type="email"
            name="receiver_email"
            value={inputData.receiver_email}
            placeholder="Enter receiver email"
            onChange={handleInputs}
            required
            style={{ width: '100%', padding: '10px 12px', fontSize: 14, boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 5, fontSize: 14 }}>Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={inputData.amount}
            placeholder="Enter amount"
            onChange={handleInputs}
            min="1"
            required
            style={{ width: '100%', padding: '10px 12px', fontSize: 14, boxSizing: 'border-box' }}
          />
        </div>

        {error && <p style={{ color: 'red', fontSize: 14 }}>{error}</p>}
        {success && <p style={{ color: 'green', fontSize: 14 }}>{success}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{ padding: '12px', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
        >
          {loading ? 'Sending…' : 'Send Money'}
        </button>

      </form>
    </div>
  )
}

export default SendMoney