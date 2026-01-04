import { useEffect, useState } from 'react';
import { getCustomers, deleteCustomer } from '../../services/customerService';
import { Link } from 'react-router-dom';
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Swal from 'sweetalert2';

const CustomerListPage = () => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);
    const limit = 10;

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await getCustomers(currentPage, limit, debouncedSearch);
                setCustomers(result.data || []);
                setTotalPages(result.totalPages || 1);
                setTotalRecords(result.totalRecords || 0);
            } catch (err) {
                alert("Gagal ambil pelanggan: " + err);
            }
        };
        loadData();
    }, [refreshKey, currentPage, debouncedSearch]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Yakin hapus pelanggan ini?',
            text: "Data yang dihapus tidak bisa dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteCustomer(id);
                    
                    Swal.fire({
                        title: 'Terhapus!',
                        text: 'Pelanggan berhasil dihapus.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    
                    setRefreshKey(old => old + 1);
                } catch {
                    Swal.fire({
                        title: 'Gagal!',
                        text: 'Gagal menghapus pelanggan.',
                        icon: 'error'
                    });
                }
            }
        });
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-8">
                <Header title="Overview" />

                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Daftar Pelanggan</h1>
                    
                    <div className="flex justify-between items-center mb-4">
                        <Link to="/customers/new" className="bg-blue-600 text-white px-4 py-2 rounded inline-block">+ Tambah Pelanggan</Link>
                        
                        <input 
                            type="text" 
                            placeholder="Cari pelanggan..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border p-2 rounded w-64"
                        />
                    </div>

                    <div className="bg-white shadow rounded overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="p-3">Nama Lengkap</th>
                                    <th className="p-3">No. Telepon</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((cust) => (
                                    <tr key={cust.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-bold">{cust.fullName}</td>
                                        <td className="p-3">{cust.phoneNumber}</td>
                                        <td className="p-3">{cust.email || '-'}</td>
                                        <td className="p-3">
                                            <button onClick={() => handleDelete(cust.id)} className="text-red-500 hover:text-red-700">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                                {customers.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="p-3 text-center text-gray-500">Belum ada data pelanggan.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-4 bg-white p-4 rounded shadow">
                        <span className="text-sm text-gray-600">
                            Total Data: <span className="font-bold">{totalRecords}</span> | 
                            Halaman <span className="font-bold">{currentPage}</span> dari {totalPages}
                        </span>
                        
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded text-sm font-medium ${
                                    currentPage === 1 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                Previous
                            </button>

                            <button 
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded text-sm font-medium ${
                                    currentPage === totalPages 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CustomerListPage;
