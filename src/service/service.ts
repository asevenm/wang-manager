import useMyFetch, { directFetch } from '../hooks/useFetch';
import type { ApiResponse } from '../types/api';

// Remove BASE_URL as we're now using relative URLs

// 服务大类
export interface ServiceCategory {
  id?: number
  name: string
  description: string
  sort_order?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

// 具体服务项目
export interface ServiceItem {
  id?: number
  category_id: number
  name: string
  description: string
  detailed_description?: string  // 详细说明
  images?: ServiceImage[]        // 服务图片
  sort_order?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface ServiceImage {
  url: string
  description: string
}

// 服务大类API
export const serviceCategoryApi = {
  async getAll(): Promise<{ data: ServiceCategory[] }> {
    const result = await useMyFetch<ServiceCategory[]>({ 
      url: '/service-categories/admin',
      method: 'get'
    });
    return {
      data: result.data.value || []
    };
  },

  async getOne(id: number): Promise<{ data: ServiceCategory }> {
    const result = await useMyFetch<ServiceCategory>({
      url: `/service-categories/${id}`,
      method: 'get'
    });
    return {
      data: (result.data.value as ServiceCategory) || ({} as ServiceCategory)
    };
  },

  async create(data: ServiceCategory): Promise<ApiResponse<ServiceCategory>> {
    return directFetch<ServiceCategory>('/service-categories', {
      method: 'POST',
      params: data,
    });
  },

  async update(id: number, data: Partial<ServiceCategory>): Promise<ApiResponse<ServiceCategory>> {
    return directFetch<ServiceCategory>(`/service-categories/${id}`, {
      method: 'PATCH',
      params: data,
    });
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    return directFetch<void>(`/service-categories/${id}`, {
      method: 'DELETE',
    });
  },
}

// 服务项目API
export const serviceApi = {
  async getAll(): Promise<{ data: ServiceItem[] }> {
    const result = await useMyFetch<ServiceItem[]>({ 
      url: '/services/admin',
      method: 'get'
    });
    return {
      data: (result.data.value as ServiceItem[]) || []
    };
  },

  async getByCategory(categoryId: number): Promise<{ data: ServiceItem[] }> {
    const result = await useMyFetch<ServiceItem[]>({ 
      url: `/service-categories/${categoryId}/services`,
      method: 'get'
    });
    return {
      data: (result.data.value as ServiceItem[]) || []
    };
  },

  async getOne(id: number): Promise<{ data: ServiceItem }> {
    const result = await useMyFetch<ServiceItem>({
      url: `/services/${id}`,
      method: 'get'
    });
    return {
      data: (result.data.value as ServiceItem) || ({} as ServiceItem)
    };
  },

  async create(data: ServiceItem): Promise<ApiResponse<ServiceItem>> {
    return directFetch<ServiceItem>('/services', {
      method: 'POST',
      params: data,
    });
  },

  async update(id: number, data: Partial<ServiceItem>): Promise<ApiResponse<ServiceItem>> {
    return directFetch<ServiceItem>(`/services/${id}`, {
      method: 'PATCH',
      params: data,
    });
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    return directFetch<void>(`/services/${id}`, {
      method: 'DELETE',
    });
  },
}