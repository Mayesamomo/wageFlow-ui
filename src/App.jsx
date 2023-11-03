
import './App.css'
import Header from './components/Header/Header';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import Dashboard from './pages/Dashboard/Dashboard';
import Client from './pages/Client/Client';
import SideBar from './components/SideBar/SideBar';
import InvoiceDetails from './components/Invoice/InvoiceDetails';
import Invoices from './pages/Invoice/Invoices';
import Invoice from './components/Invoice/Invoice';
import { ProtectedRoutes } from './utils/ProtectedRoutes';
import Home from './pages/Home/Home';
function App() {
  const user = JSON.parse(localStorage.getItem('profile'))
  return (
    <div className="App">
      {user && <SideBar />}
      <Header />
      <Routes>
      <Route path="/" element={<Home/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<h1>Not Found</h1>} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="clients" element={<Client />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="invoice/:id" exact element={<Invoice />} />
          <Route path="/invoice/:id" exact element={<InvoiceDetails />} />
          <Route path="/new-invoice" exact element={<Navigate replace to="/login" />} />
        </Route>
      </Routes>
    </div>

  )
}

export default App
