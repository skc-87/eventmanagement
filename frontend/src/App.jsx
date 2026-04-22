import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

import Login from './pages/Login';
import Signup from './pages/Signup';

import UserPortal from './pages/UserPortal';
import VendorPage from './pages/VendorPage';
import Products from './pages/Products';
import Cart from './pages/Cart';
import CheckOut from './pages/CheckOut';
import OrderStatus from './pages/OrderStatus';
import GuestList from './pages/GuestList';

import VendorPortal from './pages/VendorPortal';
import VendorDashboard from './pages/VendorDashboard';
import AddItem from './pages/AddItem';
import RequestItem from './pages/RequestItem';
import ProductStatus from './pages/ProductStatus';
import VendorTransactions from './pages/VendorTransactions';

import AdminPortal from './pages/AdminPortal';
import MaintainUser from './pages/MaintainUser';
import MaintainVendor from './pages/MaintainVendor';

function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.token) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/user/portal" element={<ProtectedRoute role="user"><UserPortal /></ProtectedRoute>} />
          <Route path="/user/vendors/:category" element={<ProtectedRoute role="user"><VendorPage /></ProtectedRoute>} />
          <Route path="/user/products/:vendorId" element={<ProtectedRoute role="user"><Products /></ProtectedRoute>} />
          <Route path="/user/cart" element={<ProtectedRoute role="user"><Cart /></ProtectedRoute>} />
          <Route path="/user/checkout" element={<ProtectedRoute role="user"><CheckOut /></ProtectedRoute>} />
          <Route path="/user/orders" element={<ProtectedRoute role="user"><OrderStatus /></ProtectedRoute>} />
          <Route path="/user/guests" element={<ProtectedRoute role="user"><GuestList /></ProtectedRoute>} />

          <Route path="/vendor/portal" element={<ProtectedRoute role="vendor"><VendorPortal /></ProtectedRoute>} />
          <Route path="/vendor/dashboard" element={<ProtectedRoute role="vendor"><VendorDashboard /></ProtectedRoute>} />
          <Route path="/vendor/add-item" element={<ProtectedRoute role="vendor"><AddItem /></ProtectedRoute>} />
          <Route path="/vendor/requests" element={<ProtectedRoute role="vendor"><RequestItem /></ProtectedRoute>} />
          <Route path="/vendor/product-status" element={<ProtectedRoute role="vendor"><ProductStatus /></ProtectedRoute>} />
          <Route path="/vendor/transactions" element={<ProtectedRoute role="vendor"><VendorTransactions /></ProtectedRoute>} />

          <Route path="/admin/portal" element={<ProtectedRoute role="admin"><AdminPortal /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute role="admin"><MaintainUser /></ProtectedRoute>} />
          <Route path="/admin/vendors" element={<ProtectedRoute role="admin"><MaintainVendor /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
