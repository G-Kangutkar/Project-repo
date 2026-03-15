
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './pages/signup'
import Login from './pages/login'
import { AuthProvider } from './context/AuthContext'
import Dashboard from './pages/Dashboard'

function App() {
  

  return (
    <>
      <BrowserRouter>
      <AuthProvider>
      <Routes>
        <Route  path='/' element={<Signup/>}/>
        <Route  path='/login' element={<Login/>}/>
        <Route path='/account' element={<Dashboard/>}/>
        
      </Routes>
      </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
