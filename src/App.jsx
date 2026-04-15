import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { FilterProvider } from './context/FilterContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import RestaurantMenu from './pages/RestaurantMenu';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Address from './pages/Address';
import AddRestaurant from './pages/AddRestaurant';
import RequireAuth from './components/RequireAuth';
import RequireAdmin from './components/RequireAdmin';
import { Toaster } from 'react-hot-toast';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageRestaurants from './pages/admin/ManageRestaurants';
import ManageOrders from './pages/admin/ManageOrders';
import Checkout from './pages/Checkout';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FilterProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/restaurant/:id" element={<RestaurantMenu />} />
                  <Route path="/cart" element={
                    <RequireAuth>
                      <Cart />
                    </RequireAuth>
                  } />
                  <Route path="/address" element={
                    <RequireAuth>
                      <Address />
                    </RequireAuth>
                  } />
                  <Route path="/orders" element={
                    <RequireAuth>
                      <Orders />
                    </RequireAuth>
                  } />
                  <Route path="/profile" element={
                    <RequireAuth>
                      <Profile />
                    </RequireAuth>
                  } />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/add-restaurant" element={
                    <RequireAdmin>
                      <AddRestaurant />
                    </RequireAdmin>
                  } />
                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <RequireAdmin>
                      <AdminLayout />
                    </RequireAdmin>
                  } />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/restaurants" element={<ManageRestaurants />} />
                  <Route path="/admin/orders" element={<ManageOrders />} />
                  <Route path="/checkout" element={
                    <RequireAuth>
                      <Checkout />
                    </RequireAuth>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </FilterProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

