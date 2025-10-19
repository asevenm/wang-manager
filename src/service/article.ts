import useMyFetch, { directFetch } from '../hooks/useFetch'
import type { ApiResponse } from '../types/api'

// 文章接口
export interface Article {
  id?: string
  title: string
  summary: string
  content: string
  coverImage?: string
  type: 'wechat' | 'video' | 'news'
  author?: string
  category?: string
  duration?: string
  views?: string
  videoUrl?: string
  published: boolean
  publishDate?: string
  createdAt?: string
  updatedAt?: string
}

// 分页查询参数
export interface ArticleQuery {
  page?: number
  limit?: number
  type?: 'wechat' | 'video' | 'news'
  keyword?: string
  category?: string
  author?: string
  published?: boolean
  sortBy?: 'createdAt' | 'updatedAt' | 'publishDate' | 'title'
  sortOrder?: 'ASC' | 'DESC'
}

// 分页结果
export interface PaginatedArticles {
  items: Article[]
  meta: {
    totalItems: number
    itemCount: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
  }
  links: {
    first: string
    previous: string
    next: string
    last: string
  }
}

// 文章API
export const articleApi = {
  // 获取文章列表（分页）
  async getAll(query: ArticleQuery = {}): Promise<{ data: PaginatedArticles }> {
    const result = await useMyFetch<PaginatedArticles>({
      url: '/articles',
      method: 'get',
      params: query
    })
    return {
      data: result.data.value || {
        items: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: 10,
          totalPages: 0,
          currentPage: 1
        },
        links: { first: '', previous: '', next: '', last: '' }
      }
    }
  },

  // 获取已发布的文章
  async getPublished(): Promise<{ data: Article[] }> {
    const result = await useMyFetch<Article[]>({
      url: '/articles/published',
      method: 'get'
    })
    return {
      data: result.data.value || []
    }
  },

  // 根据类型获取文章
  async getByType(type: 'wechat' | 'video' | 'news'): Promise<{ data: Article[] }> {
    const result = await useMyFetch<Article[]>({
      url: `/articles/type/${type}`,
      method: 'get'
    })
    return {
      data: result.data.value || []
    }
  },

  // 获取单个文章
  async getOne(id: string): Promise<{ data: Article }> {
    const result = await useMyFetch<Article>({
      url: `/articles/${id}`,
      method: 'get'
    })
    return {
      data: (result.data.value as Article) || ({} as Article)
    }
  },

  // 创建文章
  async create(data: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Article>> {
    return directFetch<Article>('/articles', {
      method: 'POST',
      params: data
    })
  },

  // 更新文章
  async update(id: string, data: Partial<Article>): Promise<ApiResponse<Article>> {
    return directFetch<Article>(`/articles/${id}`, {
      method: 'PATCH',
      params: data
    })
  },

  // 删除文章
  async delete(id: string): Promise<ApiResponse<void>> {
    return directFetch<void>(`/articles/${id}`, {
      method: 'DELETE'
    })
  },

  // 切换发布状态
  async togglePublish(id: string): Promise<ApiResponse<Article>> {
    return directFetch<Article>(`/articles/${id}/toggle-publish`, {
      method: 'PATCH'
    })
  },

  // 上传封面图片
  async uploadCover(file: File): Promise<ApiResponse<{ url: string; filename: string; originalName: string; size: number }>> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/articles/upload-cover', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }
}