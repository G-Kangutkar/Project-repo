
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './pages/signup'
import Login from './pages/login'

function App() {
  

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route  path='/' element={<Signup/>}/>
        <Route  path='/login' element={<Login/>}/>
        
      </Routes>
      
      </BrowserRouter>
    </>
  )
}

export default App
