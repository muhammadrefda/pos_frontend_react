import { useEffect, useState } from 'react';
import { getTransactions } from '../../services/transactionService';
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Swal from 'sweetalert2';
import { FiEye, FiCalendar, FiUser, FiCreditCard } from "react-icons/fi";

const TransactionListPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const limit = 10;

    useEffect(() => {
        const loadTransactions = async () => {
            setLoading(true); // Pastikan loading true saat fetch baru
            try {
                const result = await getTransactions(currentPage, limit);
                // Sesuaikan dengan struktur API: result.data atau result
                setTransactions(result.data || []);
                setTotalPages(result.totalPages || 1);
                setTotalRecords(result.totalRecords || 0);
            } catch (error) {
                console.error("Gagal ambil riwayat transaksi:", error);
                Swal.fire("Error", "Gagal memuat riwayat transaksi.", "error");
            } finally {
                setLoading(false);
            }
        };
        loadTransactions();
    }, [currentPage]); // Re-fetch saat page berubah

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const formatRupiah = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8">
                <Header title="Riwayat Transaksi" />

                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800">Riwayat Penjualan</h1>

                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-600">ID Transaksi</th>
                                    <th className="p-4 font-semibold text-gray-600">Tanggal</th>
                                    <th className="p-4 font-semibold text-gray-600">Pelanggan</th>
                                    <th className="p-4 font-semibold text-gray-600">Metode Bayar</th>
                                    <th className="p-4 font-semibold text-gray-600 text-right">Total Tagihan</th>
                                    <th className="p-4 font-semibold text-gray-600 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="p-10 text-center text-gray-500">Memuat data...</td>
                                    </tr>
                                ) : transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-10 text-center text-gray-500">Belum ada riwayat transaksi.</td>
                                    </tr>
                                ) : (
                                    transactions.map((trx) => (
                                        <tr key={trx.id} className="border-b hover:bg-gray-50 transition">
                                            <td className="p-4 font-mono text-sm text-blue-600">#TRX-{trx.id}</td>
                                            <td className="p-4 text-gray-700">
                                                <div className="flex items-center gap-2">
                                                    <FiCalendar className="text-gray-400" />
                                                    {new Date(trx.transactionDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-700">
                                                <div className="flex items-center gap-2">
                                                    <FiUser className="text-gray-400" />
                                                    {trx.customerName || trx.fullName || "Umum"}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase">
                                                    <FiCreditCard /> {trx.paymentMethod}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right font-bold text-gray-800">
                                                {formatRupiah(trx.totalAmount)}
                                            </td>
                                            <td className="p-4 text-center">
                                                <button 
                                                    onClick={() => Swal.fire('Info', 'Fitur Detail Transaksi menyusul!', 'info')}
                                                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 mx-auto"
                                                >
                                                    <FiEye /> Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-4 bg-white p-4 rounded-lg shadow">
                        <span className="text-sm text-gray-600">
                            Total Transaksi: <span className="font-bold">{totalRecords}</span> | 
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

export default TransactionListPage;
