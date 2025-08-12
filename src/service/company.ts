import useMyFetch from '../hooks/useFetch';
import type { ApiResponse } from '../types/api';

export interface Company {
  id?: number;
  address?: string;
  phone?: string;
  email?: string;
  wechatQrCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const useCompanyApi = () => {
  const getCompany = async (): Promise<{ data: Company }> => {
    const result = await useMyFetch<Company>({ 
      url: '/company', 
      method: 'get' 
    });
    return {
      data: result.data.value?.data || {} as Company
    };
  };

  const updateCompany = async (data: FormData): Promise<ApiResponse<Company>> => {
    const response = await fetch('/api/company', {
      method: 'PUT',
      body: data,
    });
    return response.json();
  };

  return {
    getCompany,
    updateCompany,
  };
};