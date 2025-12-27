import { useEffect, useState } from 'react';
import { getCategories, deleteCategory } from '../../services/categoryService';
import { Link } from 'react-router-dom';
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";


const CategoryListPage = () => {
    const [categories, setCategories] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await getCategories();
                // Sesuaikan pembungkus data dari backend (result.data atau result)
                setCategories(result.data || result);
            } catch (err) {
                alert("Gagal ambil kategori" + err);
            }
        };
        loadData();
    }, [refreshKey]);

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
                    <Link to="/categories/new" className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block">+ Tambah Baru</Link>

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
                </div>
            </div>
        </div>

    );
};
export default CategoryListPage;