import api from './api';

export const getProducts = async (page = 1, limit = 10, search = '') => {
  // Mengirim parameter pageNumber, pageSize & search ke backend
  const response = await api.get('/ProductsApi', {
    params: {
      pageNumber: page,
      pageSize: limit,
      search: search
    }
  }); 
  // Debugging biar Ali liat isi datanya
  console.log("Products: " + JSON.stringify(response.data)); 
  return response.data;
};

export const createProduct = async (payload) => {
  /* Payload butuh: 
     { 
       productName: "...", 
       categoryId: 123,  <-- INI PENTING (Harus Integer)
       price: 15000, 
       stock: 10, 
       active: true 
     } 
  */
  const response = await api.post('/ProductsApi', payload);
  return response.data;
};

export const deleteProduct = async (id) => {
  await api.delete(`/ProductsApi/${id}`);
};