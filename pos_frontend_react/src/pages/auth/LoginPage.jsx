import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Import jembatan API kita

const LoginPage = () => {
  // State untuk menyimpan input user
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); // Hook untuk pindah halaman

  const handleLogin = async (e) => {
    e.preventDefault(); // Mencegah reload halaman
    setError('');
    setLoading(true);

    try {
      // 1. Tembak API Login Backend (.NET)
      // Pastikan payload { username, password } sesuai dengan DTO Backend
      const response = await api.post('/auth/login', {
        username: username,
        password: password
      });

      console.log("Response Backend:", response.data);

      // 2. Ambil Token (Sesuaikan struktur JSON ApiResponse backendmu)
      // Biasanya: response.data.data.token atau response.data.token
      const token = response.data.data.token; 

      if (token) {
        // 3. Simpan Token dan Username di Brankas Browser (LocalStorage)
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        
        // 4. Redirect ke Dashboard
        alert("Login Berhasil! Otw Dashboard...");
        navigate('/dashboard');
      } else {
        setError("Token tidak ditemukan di response.");
      }

    } catch (err) {
      console.error("Login Error:", err);
      // Tampilkan pesan error dari backend jika ada
      const msg = err.response?.data?.message || "Gagal terhubung ke server";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">POS Login</h2>
        
        {/* Pesan Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Contoh: admin"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password..."
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full text-white font-bold py-2 px-4 rounded transition duration-200 ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Sedang Masuk...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;