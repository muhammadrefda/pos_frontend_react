import api from './api';

// Fungsi untuk mengambil semua data produk
export const getAllProducts = async () => {
  try {
    // Panggilan akan otomatis menjadi GET http://localhost:5173/api/productsApi
    const response = await api.get('/productsApi'); 
    return response.data;
  } catch (error) {
    // Anda bisa menambahkan logic error handling yang lebih baik di sini
    console.log(`Error: ${error}`)
    throw error;
  }
};

// ... fungsi lain seperti getProductById, createProduct, dsb.