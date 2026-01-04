import api from './api';

export const getCategories = async (page = 1, limit = 10, search = '') => {
  const response = await api.get('/CategoriesApi', {
    params: { 
      pageNumber: page, 
      pageSize: limit, 
      search 
    }
  });

  console.log("response: " + JSON.stringify(response.data));

  return response.data;
};

export const createCategory = async (payload) => {
  // Payload: { categoryName: "Minuman", description: "...", active: true }
  const response = await api.post('/CategoriesApi', payload);
  // Backend biasanya return: { status: true, data: { id: 1, ... } }
  // Kita return DATA aslinya saja agar seragam dengan list
  return response.data.data || response.data; 
};

export const deleteCategory = async (id) => {
  await api.delete(`/CategoriesApi/${id}`);
};