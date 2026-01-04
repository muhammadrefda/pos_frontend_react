import api from './api';

export const getTags = async (page = 1, limit = 10, search = '') => {
  const response = await api.get('/TagsApi', {
    params: { 
      pageNumber: page, 
      pageSize: limit, 
      search 
    }
  });
  return response.data;
};

export const createTag = async (payload) => {
    // payload: { tagName: "..." }
    const response = await api.post('/TagsApi', payload);
    return response.data;
};

export const deleteTag = async (id) => {
    await api.delete(`/TagsApi/${id}`);
};
