import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage'; // Import ini
import DashboardPage from './pages/dashboard/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProductListPage from './pages/products/ProductListPage';
import CategoryFormPage from './pages/categories/CategoryFormPage';
import CategoryListPage from './pages/categories/CategoryListPage';
import ProductFormPage from './pages/products/ProductFormPage';
import CustomerListPage from './pages/customers/CustomerListPage';
import CustomerFormPage from './pages/customers/CustomerFormPage';
import TagListPage from './pages/tags/TagListPage';
import TagFormPage from './pages/tags/TagFormPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>

          <Route path="/" element={<DashboardPage />} /> 
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductListPage />} /> 
          <Route path="/products/new" element={<ProductFormPage/>}/>
          <Route path="/categories" element={<CategoryListPage />} />
          <Route path="/categories/new" element={<CategoryFormPage />} />
          <Route path="/customers" element={<CustomerListPage />} />
          <Route path="/customers/new" element={<CustomerFormPage />} />
          <Route path="/tags" element={<TagListPage />} />
          <Route path="/tags/new" element={<TagFormPage />} />
           
        </Route>

        {/* Opsional: Rute 404 */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App