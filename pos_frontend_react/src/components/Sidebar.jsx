import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
    FaBox, 
    FaChartLine, 
    FaTachometerAlt, 
    FaList, 
    FaTags, 
    FaUsers, 
    FaSignOutAlt,
    FaShoppingCart,
    FaHistory 
} from "react-icons/fa";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Hook untuk mengetahui URL aktif saat ini

    const handleLogout = () => {
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
                    text: "Sampai jumpa lagi",
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                navigate('/login', {replace: true});
            };
        });
    }

    // Daftar Menu (Data-Driven)
    const menus = [
        { path: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
        { path: '/transactions', label: 'Transaksi (Kasir)', icon: <FaShoppingCart /> }, // Hati-hati, ini bisa conflict kalau exact match
        { path: '/transactions/history', label: 'Riwayat Transaksi', icon: <FaHistory /> },
        { path: '/products', label: 'Produk', icon: <FaBox /> },
        { path: '/categories', label: 'Kategori', icon: <FaList /> },
        { path: '/tags', label: 'Tag', icon: <FaTags /> },
        { path: '/customers', label: 'Pelanggan', icon: <FaUsers /> },
    ];

    // Helper Function untuk cek active link
    const isActive = (path) => {
        // Cek apakah path saat ini sama dengan menu path
        // ATAU apakah path saat ini diawali dengan menu path (untuk sub-menu/detail page)
        // Pengecualian: /transactions dan /transactions/history mirip, jadi perlu penanganan khusus
        if (path === '/transactions' && location.pathname === '/transactions/history') return false;

        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <div className="bg-gray-800 text-white w-64 min-h-screen flex flex-col transition-all duration-300">
            {/* Header Sidebar */}
            <div className="h-16 flex items-center justify-center border-b border-gray-700">
                <h1 className="text-2xl font-bold tracking-wider">POS SYSTEM</h1>
            </div>

            {/* Menu List */}
            <nav className="flex-1 px-2 py-4 space-y-2">
                {menus.map((menu) => (
                    <Link 
                        key={menu.path}
                        to={menu.path} 
                        className={`flex items-center px-4 py-3 rounded transition-colors ${
                            isActive(menu.path) 
                                ? 'bg-blue-600 text-white shadow-md' // Active Style
                                : 'hover:bg-gray-700 text-gray-300' // Inactive Style
                        }`}
                    >
                        <span className="mr-3 text-lg">{menu.icon}</span> 
                        {menu.label}
                    </Link>
                ))}

                {/* Menu Dummy/Coming Soon */}
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