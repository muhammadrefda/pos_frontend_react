import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage'; // Import ini
import DashboardPage from './pages/dashboard/DashboardPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pasang LoginPage di root */}
        <Route path="/" element={<LoginPage />} />
        
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App