import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createCategory } from '../../services/categoryService';
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";


const CategoryFormPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        categoryName: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createCategory(formData);
            alert("Kategori berhasil disimpan!");
            navigate('/categories'); // Balik ke list
        } catch {
            alert("Gagal menyimpan kategori.");
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Bagian Kiri: SIdebar */}
            <Sidebar />


            {/* Bagian: Konten Utama */}
            <div className="flex-1 p-8">
                <Header title="Overview" />

                <div className="p-6">
                    <div className="max-w-lg bg-white p-8 rounded shadow">
                        <h2 className="text-xl font-bold mb-4">Tambah Kategori Baru</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Nama Kategori</label>
                                <input
                                    type="text"
                                    name="categoryName"
                                    value={formData.categoryName}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2">Deskripsi</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 h-24"
                                ></textarea>
                            </div>

                            <div className="flex gap-2">
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                    Simpan
                                </button>
                                <Link to="/categories" className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                                    Batal
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryFormPage;