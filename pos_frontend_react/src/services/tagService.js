import api from './api';

export const getTags = async () => {
  const response = await api.get('/TagsApi');
  return response.data;
};