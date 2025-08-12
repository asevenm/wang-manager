<template>
  <div class="service-categories">
    <div class="header">
      <h1>服务大类管理</h1>
      <button @click="addCategory" class="add-button">添加服务大类</button>
    </div>

    <div class="categories-list">
      <div v-for="category in filteredCategories" :key="category.id || category.name" class="category-card">
        <div class="category-header">
          <h3>{{ category.name }}</h3>
          <div class="actions">
            <button @click="editCategory(category)" class="edit-btn">编辑</button>
            <button @click="viewServices(category)" class="services-btn">管理服务</button>
            <button 
              @click="deleteCategory(category.id!)" 
              class="delete-btn"
              :disabled="!category.id"
            >
              删除
            </button>
          </div>
        </div>
        <p class="description">{{ category.description }}</p>
        <div class="meta">
          <span class="order">排序: {{ category.sort_order }}</span>
          <span :class="['status', category.is_active ? 'active' : 'inactive']">
            {{ category.is_active ? '启用' : '禁用' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { serviceCategoryApi, type ServiceCategory } from '@/service/service'

const router = useRouter()

const categories = ref<ServiceCategory[]>([])

// 过滤出有效的服务大类数据
const filteredCategories = computed(() => {
  return categories.value.filter(category => 
    category && 
    typeof category === 'object' && 
    category.name && 
    category.description
  )
})

const loadCategories = async () => {
  try {
    const response = await serviceCategoryApi.getAll()
    console.log('Service categories response:', response)
    
    // 确保数据是数组格式
    if (response && response.data && Array.isArray(response.data)) {
      categories.value = response.data
    } else if (response && Array.isArray(response)) {
      categories.value = response
    } else {
      console.warn('Unexpected categories data format:', response)
      categories.value = []
    }
  } catch (error) {
    console.error('Failed to load service categories:', error)
    categories.value = []
  }
}

const editCategory = (category: ServiceCategory) => {
  router.push(`/service-categories/edit/${category.id}`)
}

const addCategory = () => {
  router.push('/service-categories/add')
}

const viewServices = (category: ServiceCategory) => {
  router.push(`/service-categories/${category.id}/services`)
}

const deleteCategory = async (id: number) => {
  if (!id) {
    alert('无效的服务大类ID')
    return
  }
  
  if (!confirm('确定要删除这个服务大类吗？这将同时删除该大类下的所有服务！')) return
  
  try {
    await serviceCategoryApi.delete(id)
    await loadCategories()
  } catch (error) {
    console.error('Failed to delete service category:', error)
    alert('删除失败')
  }
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.service-categories {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.add-button {
  background: #1890ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.categories-list {
  display: grid;
  gap: 20px;
}

.category-card {
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 20px;
  background: white;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.actions {
  display: flex;
  gap: 8px;
}

.edit-btn {
  background: #52c41a;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.services-btn {
  background: #1890ff;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn {
  background: #ff4d4f;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn:disabled {
  background: #d9d9d9;
  color: #999;
  cursor: not-allowed;
}

.description {
  margin-bottom: 15px;
  color: #666;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.status.active {
  color: #52c41a;
}

.status.inactive {
  color: #ff4d4f;
}
</style>