import api from './api';

export const getCategories = async () => {
  const response = await api.get('/CategoriesApi');

  console.log("response: " + JSON.stringify(response.data));

  return response.data;
};

export const createCategory = async (payload) => {
  // Payload: { categoryName: "Minuman", description: "...", active: true }
  const response = await api.post('/CategoriesApi', payload);
  return response.data;
};

export const deleteCategory = async (id) => {
  await api.delete(`/CategoriesApi/${id}`);
};