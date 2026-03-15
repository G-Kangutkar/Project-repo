
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './pages/signup'
import Login from './pages/login'
import { AuthProvider } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import SendMoney from './pages/SendMoney'
import Statement from './pages/Statement'

function App() {
  

  return (
    <>
      <BrowserRouter>
      <AuthProvider>
      <Routes>
        <Route  path='/' element={<Signup/>}/>
        <Route  path='/login' element={<Login/>}/>
        <Route path='/account' element={<Dashboard/>}/>
        <Route path='/send' element={<SendMoney/>}/>
        <Route path='/statement' element={<Statement/>}/>
      </Routes>
      </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
