import React from 'react';

const Header = ({ title = "Overview" }) => {
    // Ambil username dari localStorage, default ke 'Admin' jika tidak ada
    const username = localStorage.getItem('username') || 'Admin';
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=0D8ABC&color=fff&rounded=true`;

    return (
        <header className="bg-white shadow p-4 rounded mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">Halo, {username}</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <img 
                    src={avatarUrl} 
                    alt="User Profile" 
                    className="w-10 h-10 border-2 border-blue-500 p-0.5 rounded-full object-cover"
                />
            </div>
        </header>
    );
};

export default Header;