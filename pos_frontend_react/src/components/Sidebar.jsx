import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
    FaBox, 
    FaChartLine, 
    FaTachometerAlt, 
    FaList, 
    FaTags, 
    FaUsers, 
    FaSignOutAlt 
} from "react-icons/fa";


const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        //tampilin konfirmasi dulu
        Swal.fire({
            title: 'Yakin mau logout?',
            text: "Anda harus login ulang untuk mengakses sistem.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Keluar!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if(result.isConfirmed){
                localStorage.removeItem('token');

                Swal.fire({
                    title: 'Logout berhasil',
                    text: "sampai jumpa lagi",
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });

                navigate('/login', {replace: true});
            };
        });
    }

    return (
        <div className="bg-gray-800 text-white w-64 min-h-screen flex flex-col transition-all duration-300">
      {/* Header Sidebar */}
      <div className="h-16 flex items-center justify-center border-b border-gray-700">
        <h1 className="text-2xl font-bold tracking-wider">POS SYSTEM</h1>
      </div>

      {/* Menu List */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        <Link to="/dashboard" className="flex items-center px-4 py-3 hover:bg-gray-700 rounded transition-colors">
            <FaTachometerAlt className="mr-3" /> Dashboard
        </Link>
        
        <Link to="/products" className="flex items-center px-4 py-3 hover:bg-gray-700 rounded transition-colors">
            <FaBox className="mr-3" /> Produk
        </Link>

        <Link to="/categories" className="flex items-center px-4 py-3 hover:bg-gray-700 rounded transition-colors">
            <FaList className="mr-3" /> Kategori
        </Link>

        <Link to="/tags" className="flex items-center px-4 py-3 hover:bg-gray-700 rounded transition-colors">
            <FaTags className="mr-3" /> Tag
        </Link>

        <Link to="/customers" className="flex items-center px-4 py-3 hover:bg-gray-700 rounded transition-colors">
            <FaUsers className="mr-3" /> Pelanggan
        </Link>
        <div className="px-4 py-3 text-gray-500 cursor-not-allowed flex items-center">
             <FaChartLine className="mr-3" /> Laporan (Soon)
        </div>
      </nav>

      {/* Footer Sidebar: Tombol Logout */}
      <div className="p-4 border-t border-gray-700">
        <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-colors shadow-lg"
        >
            <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>
    </div>
    );
};

export default Sidebar;