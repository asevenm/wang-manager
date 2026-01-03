import axios from 'axios';

export const rentalApi = {
  getProducts: () => axios.get('/rental/products').then(res => res.data.data),
  createProduct: (data: any) => axios.post('/rental/products', data).then(res => res.data.data),
  updateProduct: (id: number, data: any) => axios.patch(`/rental/products/${id}`, data).then(res => res.data),
  deleteProduct: (id: number) => axios.delete(`/rental/products/${id}`).then(res => res.data),

  getNotices: () => axios.get('/rental/notices').then(res => res.data),
  createNotice: (data: any) => axios.post('/rental/notices', data).then(res => res.data),
  updateNotice: (id: number, data: any) => axios.patch(`/rental/notices/${id}`, data).then(res => res.data),
  deleteNotice: (id: number) => axios.delete(`/rental/notices/${id}`).then(res => res.data),
  updateAllNotices: (data: any[]) => axios.put('/rental/notices/bulk', data).then(res => res.data),
};
