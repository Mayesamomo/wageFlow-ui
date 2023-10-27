import './App.css'
import { Routes, Route } from 'react-router-dom'
import DashboardLayout from './components/sharedLayout/DashboardLayout'
import Client from './pages/Client'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import InvoiceTable from './pages/Invoice'
import Login from './pages/Login'
import Register from './pages/Register'
function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/invoice" element={<InvoiceTable />} />
        <Route path="/client" element={<Client />} />
      </Route>
     
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      
    </Routes>
  )
}

export default App
