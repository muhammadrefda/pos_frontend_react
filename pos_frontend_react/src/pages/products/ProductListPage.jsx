import React, { useState, useEffect } from 'react';
import { getAllProducts } from '../../services/productService'; 
// Asumsikan Ali akan menempatkan file ini di src/pages/products

const ProductListPage = () => {
    // State untuk menyimpan daftar produk
    const [products, setProducts] = useState([]); 
    // State untuk menangani status loading
    const [isLoading, setIsLoading] = useState(true);
    // State untuk menangani error
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fungsi async untuk mengambil data
        const fetchProducts = async () => {
            try {
                // 1. Reset error dan set loading ke true
                setError(null);
                setIsLoading(true); 

                // 2. Panggil service layer
                const data = await getAllProducts(); 
                
                // 3. Simpan data ke state
                setProducts(data);
            } catch (err) {
                // 4. Tangani error
                setError('Gagal memuat data produk dari API. Cek koneksi backend.');
                setProducts([]); // Kosongkan produk jika ada error
            } finally {
                // 5. Matikan status loading
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []); // Array kosong berarti fungsi hanya dijalankan sekali setelah komponen dimuat (componentDidMount)

    // --- Rendernya ---

    // 1. Tampilkan Loading
    if (isLoading) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold">Daftar Produk</h1>
                <p className="mt-4">Memuat data produk... (Loading Spinner)</p>
            </div>
        );
    }

    // 2. Tampilkan Error
    if (error) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold">Daftar Produk</h1>
                <p className="mt-4 text-red-600 border border-red-300 p-4 bg-red-50">{error}</p>
            </div>
        );
    }

    // 3. Tampilkan Data (Penting untuk Ali, agar bisa melihat hasilnya)
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Daftar Produk ({products.length} item)</h1>
            <p className="text-gray-500 mb-6">Pastikan API .NET berjalan di port yang benar.</p>
            
            <div className="bg-white p-6 shadow-md rounded-lg">
                <h2 className="text-lg font-semibold mb-4">Hasil Fetch Data (Format Mentah)</h2>
                {/* Tampilkan data mentah untuk debugging dan konfirmasi */}
                <pre className="whitespace-pre-wrap break-words bg-gray-100 p-3 rounded text-sm max-h-96 overflow-auto">
                    {JSON.stringify(products, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default ProductListPage;