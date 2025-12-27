import { useState, useEffect, useMemo } from 'react';
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { getProducts } from '../../services/productService';
import { getCustomers } from '../../services/customerService';
import { createTransaction } from '../../services/transactionService';
import Swal from 'sweetalert2';

// Import Icons dari React Icons untuk UI yang lebih cantik
import { FiShoppingCart, FiTrash2, FiSearch, FiPlus, FiMinus } from "react-icons/fi";

const TransactionPage = () => {
    // --- 1. STATE MANAGEMENT (Tempat penyimpanan data sementara) ---
    
    // Data Master (dari Database)
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    
    // State Transaksi
    const [cart, setCart] = useState([]); // Keranjang belanja (Array of Objects)
    const [selectedCustomerId, setSelectedCustomerId] = useState(''); // Customer yang dipilih
    const [paymentMethod, setPaymentMethod] = useState('Cash'); // Default Cash
    const [searchQuery, setSearchQuery] = useState(''); // Fitur pencarian produk

    // --- 2. LIFECYCLE (Apa yang terjadi saat halaman pertama dibuka) ---
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Panggil API Produk dan Customer secara paralel agar lebih cepat
                const [productData, customerData] = await Promise.all([
                    getProducts(),
                    getCustomers()
                ]);

                setProducts(productData.data || productData);
                setCustomers(customerData.data || customerData);
            } catch (error) {
                console.error("Gagal memuat data:", error);
                Swal.fire("Error", "Gagal memuat data produk/customer.", "error");
            }
        };
        loadInitialData();
    }, []);

    // --- 3. LOGIC KERANJANG BELANJA (CORE LOGIC) ---

    // Fungsi: Menambahkan produk ke keranjang
    const handleAddToCart = (product) => {
        // Cek stok dulu
        if (product.stock <= 0) {
            Swal.fire("Stok Habis", "Produk ini sedang tidak tersedia.", "warning");
            return;
        }

        setCart((prevCart) => {
            // Cek apakah barang sudah ada di keranjang?
            const existingItem = prevCart.find(item => item.id === product.id);

            if (existingItem) {
                // Jika sudah ada, update qty-nya saja (+1)
                // Cek stok lagi agar tidak melebihi stok database
                if (existingItem.qty + 1 > product.stock) {
                    Swal.fire("Stok Tidak Cukup", "Jumlah melebihi stok tersedia.", "warning");
                    return prevCart;
                }

                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, qty: item.qty + 1 }
                        : item
                );
            } else {
                // Jika belum ada, masukkan sebagai item baru
                return [...prevCart, { ...product, qty: 1 }];
            }
        });
    };

    // Fungsi: Mengubah jumlah (tambah/kurang) langsung dari keranjang
    const handleUpdateQty = (productId, delta) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.id === productId) {
                    const newQty = item.qty + delta;
                    // Mencegah qty jadi 0 atau minus (minimal 1)
                    // (Opsional: bisa dibuat auto-remove jika 0, tapi di sini kita limit ke 1)
                    if (newQty < 1) return item; 
                    
                    // Cek stok maksimal
                    if (newQty > item.stock) {
                        Swal.fire("Max Stok", "Stok tidak mencukupi.", "info");
                        return item;
                    }
                    return { ...item, qty: newQty };
                }
                return item;
            });
        });
    };

    // Fungsi: Menghapus item dari keranjang
    const handleRemoveItem = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    // --- 4. COMPUTED VALUES (Hitung-hitungan otomatis) ---
    // Gunakan useMemo agar tidak menghitung ulang terus menerus kecuali cart berubah
    const grandTotal = useMemo(() => {
        return cart.reduce((total, item) => total + (item.price * item.qty), 0);
    }, [cart]);

    const filteredProducts = products.filter(p => 
        p.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // --- 5. LOGIC CHECKOUT (Integrasi ke Backend) ---
    const handleCheckout = async () => {
        // Validasi Input
        if (!selectedCustomerId) {
            Swal.fire("Pilih Pelanggan", "Mohon pilih pelanggan terlebih dahulu.", "warning");
            return;
        }
        if (cart.length === 0) {
            Swal.fire("Keranjang Kosong", "Belum ada produk yang dipilih.", "warning");
            return;
        }

        // Konfirmasi User
        const confirm = await Swal.fire({
            title: 'Proses Transaksi?',
            text: `Total tagihan: Rp ${grandTotal.toLocaleString('id-ID')}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Bayar',
            cancelButtonText: 'Batal'
        });

        if (!confirm.isConfirmed) return;

        try {
            // Persiapkan Payload sesuai DTO Backend (TransactionCreateDto)
            const payload = {
                customerId: Number(selectedCustomerId),
                paymentMethod: paymentMethod,
                details: cart.map(item => ({
                    productId: item.id,
                    qty: item.qty,
                    unitPrice: item.price
                }))
            };

            // Kirim ke API
            await createTransaction(payload);

            // Jika sukses
            Swal.fire("Berhasil!", "Transaksi telah disimpan.", "success");
            setCart([]); // Kosongkan keranjang
            setSelectedCustomerId(''); // Reset customer (opsional)
        } catch (error) {
            console.error("Checkout Failed:", error);
            Swal.fire("Gagal", "Terjadi kesalahan saat memproses transaksi.", "error");
        }
    };

    // Helper Format Rupiah
    const formatRupiah = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            <Sidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Header title="Kasir / Point of Sale" />

                {/* Konten Utama: Dibagi 2 Kolom (Kiri: Produk, Kanan: Cart) */}
                <div className="flex-1 flex overflow-hidden p-4 gap-4">
                    
                    {/* --- KOLOM KIRI: LIST PRODUK --- */}
                    <div className="flex-1 flex flex-col bg-white rounded-lg shadow overflow-hidden">
                        {/* Search Bar */}
                        <div className="p-4 border-b flex items-center gap-2">
                            <FiSearch className="text-gray-400 text-xl" />
                            <input 
                                type="text" 
                                placeholder="Cari produk..." 
                                className="flex-1 outline-none text-gray-700"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Grid Produk */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {filteredProducts.map(product => (
                                    <div 
                                        key={product.id} 
                                        onClick={() => handleAddToCart(product)}
                                        className={`bg-white p-4 rounded shadow hover:shadow-lg transition cursor-pointer border border-transparent hover:border-blue-500 relative ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <div className="h-24 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-400">
                                            {/* Placeholder Gambar */}
                                            <FiShoppingCart size={32} />
                                        </div>
                                        <h3 className="font-bold text-gray-800 text-sm truncate">{product.productName}</h3>
                                        <p className="text-blue-600 font-semibold">{formatRupiah(product.price)}</p>
                                        <p className="text-xs text-gray-500 mt-1">Stok: {product.stock}</p>

                                        {/* Badge Stok Habis */}
                                        {product.stock === 0 && (
                                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Habis</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- KOLOM KANAN: KERANJANG (CART) --- */}
                    <div className="w-96 bg-white rounded-lg shadow flex flex-col border-l">
                        {/* Header Cart: Pilih Customer */}
                        <div className="p-4 border-b bg-gray-50">
                            <h2 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <FiShoppingCart /> Keranjang Belanja
                            </h2>
                            <select 
                                className="w-full border p-2 rounded text-sm bg-white focus:ring-2 focus:ring-blue-500"
                                value={selectedCustomerId}
                                onChange={(e) => setSelectedCustomerId(e.target.value)}
                            >
                                <option value="">-- Pilih Pelanggan --</option>
                                {customers.map(c => (
                                    <option key={c.id} value={c.id}>{c.fullName}</option>
                                ))}
                            </select>
                        </div>

                        {/* List Item di Keranjang */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {cart.length === 0 ? (
                                <div className="text-center text-gray-400 mt-10">
                                    <p>Keranjang kosong</p>
                                    <p className="text-xs">Pilih produk di sebelah kiri</p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-center border-b pb-2">
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm text-gray-800">{item.productName}</p>
                                            <p className="text-xs text-blue-600">{formatRupiah(item.price)}</p>
                                        </div>
                                        
                                        {/* Kontrol Qty */}
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleUpdateQty(item.id, -1)}
                                                className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                                            >
                                                <FiMinus size={12}/>
                                            </button>
                                            <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                                            <button 
                                                onClick={() => handleUpdateQty(item.id, 1)}
                                                className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                                            >
                                                <FiPlus size={12}/>
                                            </button>
                                        </div>

                                        {/* Hapus Item */}
                                        <button 
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="ml-3 text-red-400 hover:text-red-600"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer Cart: Total & Checkout */}
                        <div className="p-4 border-t bg-gray-50">
                            <div className="flex justify-between mb-2 text-sm">
                                <span>Subtotal</span>
                                <span>{formatRupiah(grandTotal)}</span>
                            </div>
                            <div className="flex justify-between mb-4 text-xl font-bold text-gray-800">
                                <span>Total</span>
                                <span>{formatRupiah(grandTotal)}</span>
                            </div>

                            {/* Pilihan Metode Bayar */}
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-600 mb-1">Metode Pembayaran</label>
                                <select 
                                    className="w-full border p-2 rounded text-sm"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    <option value="Cash">Cash / Tunai</option>
                                    <option value="QRIS">QRIS</option>
                                    <option value="Transfer">Transfer Bank</option>
                                </select>
                            </div>

                            <button 
                                onClick={handleCheckout}
                                disabled={cart.length === 0}
                                className={`w-full py-3 rounded font-bold text-white transition ${
                                    cart.length === 0 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700 shadow-lg'
                                }`}
                            >
                                PROSES PEMBAYARAN
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionPage;