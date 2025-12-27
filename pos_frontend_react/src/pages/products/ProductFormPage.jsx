import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createProduct } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import { getTags } from '../../services/tagService'; 
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Swal from 'sweetalert2';

const ProductFormPage = () => {
    const navigate = useNavigate();

    // State Data Master
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    // State Form
    const [formData, setFormData] = useState({
        productName: '',
        categoryId: '',
        price: 0,
        stock: 0,
        tagIds: [], 
        active: true
    });

    // Lifecycle: Ambil Kategori DAN Tags
    useEffect(() => {
        const loadMasterData = async () => {
            try {
                const catData = await getCategories();
                setCategories(catData.data || catData);

                const tagData = await getTags();
                setTags(tagData.data || tagData);
            } catch (err) {
                console.error(err);
            }
        };
        loadMasterData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTagChange = (e) => {
        const tagId = Number(e.target.value); 
        const isChecked = e.target.checked;   

        let newTagIds = [...formData.tagIds]; 

        if (isChecked) {
            newTagIds.push(tagId);
        } else {
            newTagIds = newTagIds.filter(id => id !== tagId);
        }

        setFormData({ ...formData, tagIds: newTagIds });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                categoryId: Number(formData.categoryId),
                price: Number(formData.price),
                stock: Number(formData.stock),
            };

            await createProduct(payload);

            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Produk berhasil disimpan ke database.',
                showConfirmButton: true,
            }).then(() => {
                navigate('/products');
            });

        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Gagal menyimpan produk. Cek koneksi atau data input.',
            });
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Bagian Kiri: Sidebar */}
            <Sidebar />

            {/* Bagian: Konten Utama */}
            <div className="flex-1 p-8">
                <Header title="Overview" />
                <div className="p-6">
                    <div className="max-w-lg bg-white p-8 rounded shadow">
                        <h2 className="text-xl font-bold mb-4">Tambah Produk Baru</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Nama Produk</label>
                                <input type="text" name="productName" onChange={handleChange} className="w-full border p-2 rounded" required />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Kategori</label>
                                <select name="categoryId" onChange={handleChange} className="w-full border p-2 rounded" required>
                                    <option value="">-- Pilih Kategori --</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">Harga</label>
                                    <input type="number" name="price" onChange={handleChange} className="w-full border p-2 rounded" required />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Stok</label>
                                    <input type="number" name="stock" onChange={handleChange} className="w-full border p-2 rounded" required />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2 font-bold">Tags (Pilih Minimal Satu)</label>
                                <div className="flex flex-wrap gap-3 p-3 border rounded bg-gray-50">
                                    {tags.length === 0 && <p className="text-sm text-gray-400">Belum ada tag tersedia.</p>}

                                    {tags.map((tag) => (
                                        <label key={tag.id} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                value={tag.id}
                                                onChange={handleTagChange}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-gray-700 text-sm">{tag.tagName}</span>
                                        </label>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">*Boleh pilih lebih dari satu</p>
                            </div>

                            <div className="flex gap-2">
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Simpan</button>
                                <Link to="/products" className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">Batal</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductFormPage;