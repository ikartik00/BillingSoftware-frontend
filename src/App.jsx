import React, { useContext } from 'react'
import Navbar from './Component/Navbar'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Dashboard from './Pages/Dashboard'
import Explore from './Pages/Explore'
import ManageCategorie from './Pages/ManageCategories'
import ManageCategories from './Pages/ManageCategories'
import ManageItems from './Pages/ManageItems'
import ManageUsers from './Pages/ManageUsers'
import { Toaster } from 'react-hot-toast'
import Login from './Pages/Login'
import Register from './Pages/Register'
import OrderHistory from './Pages/OrderHistory'
import { AppContext } from './Context/AppContextProvider'
import NotFound from './Pages/NotFound'
import AddStock from './Pages/AddStock'
import Setting from './Pages/Setting'

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { auth } = useContext(AppContext)
  const token = auth.token || localStorage.getItem("token")
  const role = auth.role || localStorage.getItem("role")

  if (!token) {
    return <Navigate to={"/login"} />
  }
  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    return <Navigate to={"/dashboard"} />
  }
  return element;
}

const LoginRoute = ({ element }) => {
  const { auth } = useContext(AppContext)
  if (auth && auth.token) {
    return <Navigate to={"/dashboard"} />
  }
  return element
}

const App = () => {
  const location = useLocation();
  const { auth } = useContext(AppContext)


  return (

    <div>
      {location.pathname !== "/login" && location.pathname != "/register" && <Navbar />}
      <Toaster />
      <Routes>
        <Route path='/' element={<ProtectedRoute element={<Dashboard />}/>} />
        <Route path='/dashboard' element={<ProtectedRoute element={<Dashboard />}/>} />
        <Route path='/explore' element={<ProtectedRoute element={<Explore />}/>} />
        <Route path='/setting' element={<ProtectedRoute element={<Setting />}/>} />


        <Route path='/categories' element={<ProtectedRoute element={<ManageCategories />} allowedRoles={["ADMIN"]} />} />
        <Route path='/items' element={<ProtectedRoute element={<ManageItems />} allowedRoles={["ADMIN"]} />} />
        <Route path='/users' element={<ProtectedRoute element={<ManageUsers />} allowedRoles={["ADMIN"]} />} />
         <Route path='/add-stock' element={<ProtectedRoute element={<AddStock />} allowedRoles={["ADMIN"]} />} />

        <Route path='/login' element={<LoginRoute element={<Login />} />} />
        <Route path='/register' element={<LoginRoute element={<Register />} />} />

        <Route path='/order-history' element={<ProtectedRoute element={<OrderHistory />}/>} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App