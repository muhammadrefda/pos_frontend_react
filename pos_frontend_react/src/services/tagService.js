import api from './api';

export const getTags = async () => {
  const response = await api.get('/TagsApi');
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
