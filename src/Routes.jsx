import { Dashboard,Client, Invoice, Login, Register, Home, } from "./pages"
import {Routes, Route } from "react-router-dom"
const MainRoutes = () => {
  return (
    <Routes>
      <Route    path="/" element={<Home />} />
        <Route    path="/login" element={<Login />} />
        <Route    path="/register" element={<Register />} />
        <Route    path="/dashboard" element={<Dashboard />} />
        <Route    path="/invoice" element={<Invoice />} />
        <Route    path="/client" element={<Client />} />
        
    </Routes>
  )
}

export default MainRoutes
