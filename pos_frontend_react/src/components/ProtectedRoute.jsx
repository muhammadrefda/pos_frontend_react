import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // 1. Cek Token di localStorage
  const token = localStorage.getItem('token'); // Pastikan nama key sesuai saat login

  // 2. Jika token TIDAK ADA (pengguna belum login)
  if (!token) {
    // Redirect pengguna ke halaman /login
    return <Navigate to="/login" replace />; 
  }

  // 3. Jika token ADA (pengguna sudah login)
  // Render children/komponen yang ada di dalam rute ini. 
  // Jika menggunakan element langsung di <Route>, gunakan `Outlet`

  //TODO: cari tau Outlet ini untuk apa, dan kenapa pakai Outlet
  return <Outlet />; 
};

export default ProtectedRoute;