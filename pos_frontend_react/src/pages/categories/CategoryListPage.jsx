import { useEffect, useState } from 'react';
import { getCategories, deleteCategory } from '../../services/categoryService';
import { Link } from 'react-router-dom';
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";


const CategoryListPage = () => {
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);
    const limit = 10;

    // Debounce Logic: Update debouncedSearch after 500ms of inactivity
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1); // Reset to page 1 on new search
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await getCategories(currentPage, limit, debouncedSearch);
                setCategories(result.data || []);
                setTotalPages(result.totalPages || 1);
                setTotalRecords(result.totalRecords || 0);
            } catch (err) {
                alert("Gagal ambil kategori" + err);
            }
        };
        loadData();
    }, [refreshKey, currentPage, debouncedSearch]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Hapus kategori ini?")) return;
        await deleteCategory(id);
        setRefreshKey(old => old + 1); // Refresh tabel
    };

    return (

        <div className='flex min-h-screen bg-gray-100'>
            {/* Bagian Kiri: SIdebar */}

            <Sidebar />
            {/* Bagian: Konten Utama */}
            <div className="flex-1 p-8">
                <Header title="Overview" />


                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Master Kategori</h1>
                    
                    <div className="flex justify-between items-center mb-4">
                        <Link to="/categories/new" className="bg-blue-600 text-white px-4 py-2 rounded inline-block">+ Tambah Baru</Link>
                        
                        <input 
                            type="text" 
                            placeholder="Cari kategori..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border p-2 rounded w-64"
                        />
                    </div>

                    <div className="bg-white shadow rounded overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="p-3">Nama</th>
                                    <th className="p-3">Deskripsi</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat) => (
                                    <tr key={cat.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{cat.categoryName}</td>
                                        <td className="p-3">{cat.description}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded text-xs ${cat.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {cat.active ? 'Aktif' : 'Non-Aktif'}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-700">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
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
export default CategoryListPage;