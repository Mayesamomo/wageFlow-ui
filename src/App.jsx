import './App.css'
import { useEffect } from 'react'
import { RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route } from 'react-router-dom'
import DashboardLayout from './components/sharedLayout/DashboardLayout'
import Client from './pages/Client'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import InvoiceTable from './pages/Invoice'
import LoginPage from './pages/Login'
import Register from './pages/Register'

import Store from "./redux/store";
import { loadUser } from "./redux/action/user";
import { getAllClients } from './redux/action/client'
import ProtectedRoute from './routes/protectedRoute'
const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<Home/>} >
     <Route index element={<Home/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/register" element={<Register/>} />
     <Route element={<ProtectedRoute/>}>
      <Route path="/" element={<DashboardLayout/>}>
        <Route index element={<Dashboard/>} />
        <Route path="/client" element={<Client/>} />
        <Route path="/invoice" element={<InvoiceTable/>} />
      </Route>
     </Route>
  </Route>
))
function App() {

  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(getAllClients());
  }, [])

 
  return (
    <RouterProvider router={router} />
  )
}

export default App
