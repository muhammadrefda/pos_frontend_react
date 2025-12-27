import api from './api';

// Service untuk menangani semua request ke TransactionController
export const createTransaction = async (payload) => {
    const response = await api.post('/TransactionsApi', payload);
    return response.data;
};

// Ambil semua riwayat transaksi
export const getTransactions = async () => {
    const response = await api.get('/TransactionsApi');
    return response.data;
};

// Ambil detail satu transaksi (jika dibutuhkan)
export const getTransactionById = async (id) => {
    const response = await api.get(`/TransactionsApi/${id}`);
    return response.data;
};
