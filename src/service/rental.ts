import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

export const rentalApi = {
  getProducts: () => api.get('/rental/products').then(res => res.data.data),
  createProduct: (data: any) => api.post('/rental/products', data).then(res => res.data.data),
  updateProduct: (id: number, data: any) => api.patch(`/rental/products/${id}`, data).then(res => res.data.data),
  deleteProduct: (id: number) => api.delete(`/rental/products/${id}`).then(res => res.data.data),

  getNotices: () => api.get('/rental/notices').then(res => res.data.data),
  createNotice: (data: any) => api.post('/rental/notices', data).then(res => res.data.data),
  updateNotice: (id: number, data: any) => api.patch(`/rental/notices/${id}`, data).then(res => res.data.data),
  deleteNotice: (id: number) => api.delete(`/rental/notices/${id}`).then(res => res.data.data),
  updateAllNotices: (data: any[]) => api.put('/rental/notices/bulk', data).then(res => res.data.data),
};
