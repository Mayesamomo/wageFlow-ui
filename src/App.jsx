import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardLayout from './components/sharedLayout/DashboardLayout'
import { PublicLayout } from './components/sharedLayout/PublicLayout'
import InvoiceTable from './pages/Invoice'
import Client from './pages/Client'
import LoginPage from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route exact  path='/' element={<Home/>} />
          <Route path='login' element={<LoginPage />} />
          <Route path='register' element={<Register />} />
        </Route>
        
        <Route exact path='/' element={<DashboardLayout />} >
        <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/invoice' element={<InvoiceTable />} />
          <Route path='invoice/:id' element={<InvoiceTable />} />
          <Route path='invoice/:id/edit' element={<InvoiceTable />} />
          <Route path='invoice/:id/delete' element={<InvoiceTable />} />
          <Route path='client' element={<Client />} />
        </Route>
      </Routes>
    </BrowserRouter>


  )
}

export default App
