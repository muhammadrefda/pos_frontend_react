import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage'; // Import ini
import DashboardPage from './pages/dashboard/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProductListPage from './pages/products/ProductListPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
       {/* Semua route disini akan di cek tokennya oleh ProtectedRoute */}
          <Route path="/" element={<DashboardPage />} /> 
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductListPage />} /> 
          {/* ... rute lain seperti /customers, /products, /transaksi */}
        </Route>

        {/* Opsional: Rute 404 */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App