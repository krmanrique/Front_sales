import Login from './components/Login'
import Register from './components/Register'
import Inventory from './components/Inventory';
import Order from './components/Order';
import Admin from './components/Admin';
import AdminDashboard from './pages/AdminDashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';
import { useState } from 'react';
import './App.css'
import { Route, Routes } from 'react-router-dom';

function App() {

  const [user, setUser] = useState([])
  const [product, setProduct] = useState([])
  const [order, setOrder] = useState([])
  const [admin, setAdmin] = useState([])
  const [adminDashboard, setAdminDashboard] = useState([])
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])

  return (
    <div className='App'>
      <Routes>
      {/* {
        !user.length > 0
          ? <Login setUser={setUser} />
          : <Admin user={user} setUser={setUser} />
      } */}
        <Route exact path="/" element={<Login setUser={setUser} />}/>
        <Route exact path="/register" element={<Register setUser={setUser} />}/>
        <Route exact path="/inventory" element={<Inventory setUser={setProduct} />}/>
        <Route exact path="/order" element={<Order setUser={setOrder} />}/>
        <Route exact path="/admin" element={<Admin setUser={setAdmin} />}/>
        <Route exact path="/adminDashboard" element={<AdminDashboard setUser={setAdminDashboard} />}/>
        <Route exact path="/orders" element={<Orders setUser={setOrders} />}/>
        <Route exact path="/products" element={<Products setUser={setProducts} />}/>
      </Routes>
      
    </div>
  )
}

export default App
