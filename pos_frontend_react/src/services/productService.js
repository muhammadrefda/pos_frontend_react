import api from './api';

export const getProducts = async () => {
  const response = await api.get('/ProductsApi'); 
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