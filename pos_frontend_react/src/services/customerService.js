import api from './api';

export const getCustomers = async (page = 1, limit = 10, search = '') => {
  const response = await api.get('/CustomersApi', {
    params: { 
      pageNumber: page, 
      pageSize: limit, 
      search 
    }
  }); 
  return response.data;
};

export const createCustomer = async (payload) => {
  /* Payload example: 
     { 
       name: "John Doe", 
       phoneNumber: "08123456789", 
       email: "john@example.com", 
       address: "Jl. Merdeka No. 1" 
     } 
  */
  const response = await api.post('/CustomersApi', payload);
  return response.data;
};

export const deleteCustomer = async (id) => {
  await api.delete(`/CustomersApi/${id}`);
};
