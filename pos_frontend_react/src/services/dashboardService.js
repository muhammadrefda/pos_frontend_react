import api from './api';

const getSummary = async () => {
  const response = await api.get('/dashboard/summary');
  return response.data;
};

const getSalesChart = async () => {
  const response = await api.get('/dashboard/sales-chart');
  return response.data;
};

const getTopProducts = async (count = 5) => {
  const response = await api.get(`/dashboard/top-products?count=${count}`);
  return response.data;
};

export default {
  getSummary,
  getSalesChart,
  getTopProducts,
};
