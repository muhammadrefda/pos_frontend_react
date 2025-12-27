import { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../../services/productService';
import { Link } from 'react-router-dom';
import Sidebar from "../../components/Sidebar";
import Swal from 'sweetalert2';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await getProducts();
                setProducts(result.data || result);
            } catch (err) {
                alert("Gagal ambil produk: " + err);
            }
        };
        loadData();
    }, [refreshKey]);

    const handleDelete = (id) => {
        // 1. Tampilkan Konfirmasi Dulu
        Swal.fire({
            title: 'Yakin hapus produk ini?',
            text: "Data yang dihapus tidak bisa dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33', // Warna merah untuk tombol hapus
            cancelButtonColor: '#3085d6', // Warna biru untuk batal
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            // 2. Jika user klik "Ya"
            if (result.isConfirmed) {
                try {
                    await deleteProduct(id);
                    
                    // 3. Tampilkan Sukses & Refresh Data
                    Swal.fire({
                        title: 'Terhapus!',
                        text: 'Produk berhasil dihapus.',
                        icon: 'success',
                        timer: 1500, // Otomatis tutup setelah 1.5 detik
                        showConfirmButton: false
                    });
                    
                    setRefreshKey(old => old + 1); // Refresh tabel
                } catch {
                    // Handle Error
                    Swal.fire({
                        title: 'Gagal!',
                        text: 'Gagal menghapus produk (Mungkin sedang digunakan di transaksi).',
                        icon: 'error'
                    });
                }
            }
        });
    };

    // Helper function untuk format Rupiah (Bonus UX)
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Bagian Kiri: SIdebar */}
            <Sidebar />


            {/* Bagian: Konten Utama */}
            <div className="flex-1 p-8">
                <header className="bg-white shadow p-4 rounded mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Halo, Admin</span>
                        <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                    </div>
                </header>

                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Daftar Produk</h1>
                    <Link to="/products/new" className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block">+ Tambah Produk</Link>

                    <div className="bg-white shadow rounded overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="p-3">Nama Produk</th>
                                    {/* Kalau backend kirim CategoryName, tampilkan. Kalau cuma ID, tampilkan ID dulu gapapa */}
                                    <th className="p-3">Kategori</th>
                                    <th className="p-3">Harga</th>
                                    <th className="p-3">Stok</th>
                                    <th className="p-3">Tag</th>
                                    <th className="p-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((prod) => (
                                    <tr key={prod.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-bold">{prod.productName}</td>
                                        {/* Asumsi backend mengirim object category atau categoryName */}
                                        <td className="p-3">
                                            {prod.category ? prod.category.categoryName : prod.categoryId}
                                        </td>
                                        <td className="p-3">{formatRupiah(prod.price)}</td>
                                        <td className="p-3">{prod.stock} pcs</td>
                                        <td className="p-3">
                                            <div className="flex flex-wrap gap-1">
                                                {/* Cek apakah ada tags, lalu looping */}
                                                {prod.tags && prod.tags.map((tag) => (
                                                    <span key={tag.id} className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded">
                                                        {tag.tagName}
                                                    </span>
                                                ))}
                                                {(!prod.tags || prod.tags.length === 0) && <span className="text-gray-400 text-xs">-</span>}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <button onClick={() => handleDelete(prod.id)} className="text-red-500 hover:text-red-700">Hapus</button>
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
export default ProductListPage;