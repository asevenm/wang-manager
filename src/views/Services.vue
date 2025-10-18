<template>
  <div class="services-management">
    <div class="header">
      <h1>服务管理</h1>
      <button @click="addCategory" class="add-button">添加服务类别</button>
    </div>

    <div class="categories-list">
      <div v-for="category in categories" :key="category.id" class="category-card">
        <div class="category-header">
          <div class="category-info">
            <h2>{{ category.name }}</h2>
            <p class="category-description">{{ category.description }}</p>
          </div>
          <div class="category-actions">
            <button @click="editCategory(category)" class="edit-btn">编辑类别</button>
            <button @click="addService(category.id!)" class="add-service-btn">添加服务</button>
            <button @click="deleteCategory(category.id!)" class="delete-btn">删除类别</button>
          </div>
        </div>
        
        <div class="services-grid">
          <div 
            v-for="service in getServicesByCategory(category.id!)" 
            :key="service.id" 
            class="service-item"
          >
            <div class="service-preview">
              <img 
                v-if="service.images && service.images.length > 0" 
                :src="service.images[0].url" 
                :alt="service.name"
                class="service-image"
              />
              <div v-else class="service-placeholder">
                <span>暂无图片</span>
              </div>
            </div>
            <div class="service-content">
              <h3>{{ service.name }}</h3>
              <p class="service-description">{{ service.description }}</p>
              <div class="service-actions">
                <button @click="editService(service)" class="edit-service-btn">编辑</button>
                <button @click="deleteService(service.id!)" class="delete-service-btn">删除</button>
              </div>
            </div>
          </div>
          <div class="add-service-card" @click="addService(category.id!)">
            <span class="add-icon">+</span>
            <span>添加服务</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 如果没有类别 -->
    <div v-if="categories.length === 0" class="empty-state">
      <h3>暂无服务类别</h3>
      <p>请先添加服务类别，然后在类别下添加具体服务。</p>
      <button @click="addCategory" class="add-button">添加首个类别</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { serviceCategoryApi, serviceApi, type ServiceCategory, type ServiceItem } from '@/service/service'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const categories = ref<ServiceCategory[]>([])
const services = ref<ServiceItem[]>([])

const loadCategories = async () => {
  try {
    const response = await serviceCategoryApi.getAll()
    console.log(response.data)
    categories.value = response.data
  } catch (error) {
    console.error('Failed to load categories:', error)
    categories.value = []
  }
}

const loadServices = async () => {
  try {
    const response = await serviceApi.getAll()
    services.value = response.data.data || []
  } catch (error) {
    console.error('Failed to load services:', error)
    services.value = []
  }
}

const getServicesByCategory = (categoryId: number) => {
  return services.value.filter(service => service.category_id === categoryId)
}

const addCategory = () => {
  router.push('/services/categories/add')
}

const editCategory = (category: ServiceCategory) => {
  router.push(`/services/categories/edit/${category.id}`)
}

const deleteCategory = async (id: number) => {
  if (!confirm('确定要删除这个服务类别吗？删除后该类别下的所有服务也将被删除。')) return
  
  try {
    await serviceCategoryApi.delete(id)
    await Promise.all([loadCategories(), loadServices()])
    ElMessage.success('删除成功')
  } catch (error) {
    console.error('Failed to delete category:', error)
    ElMessage.error('删除失败')
  }
}

const addService = (categoryId: number) => {
  router.push(`/services/add?category=${categoryId}`)
}

const editService = (service: ServiceItem) => {
  router.push(`/services/edit/${service.id}`)
}

const deleteService = async (id: number) => {
  if (!ElMessageBox.confirm('确定要删除这个服务吗？')) return
    
  try {
    await serviceApi.delete(id)
    await loadServices()
    ElMessage.success('删除成功')
  } catch (error) {
    console.error('Failed to delete service:', error)
    ElMessage.error('删除失败')
  }
}

onMounted(async () => {
  await Promise.all([loadCategories(), loadServices()])
})
</script>

<style scoped>
.services-management {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e8e8e8;
}

.header h1 {
  margin: 0;
  color: #1a1a1a;
}

.add-button {
  background: #1890ff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.add-button:hover {
  background: #40a9ff;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.category-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f5f5f5;
}

.category-info h2 {
  margin: 0 0 8px 0;
  color: #1a1a1a;
  font-size: 20px;
}

.category-description {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.category-actions {
  display: flex;
  gap: 8px;
}

.edit-btn,
.add-service-btn,
.delete-btn {
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.edit-btn {
  background: #52c41a;
  color: white;
}

.edit-btn:hover {
  background: #73d13d;
}

.add-service-btn {
  background: #1890ff;
  color: white;
}

.add-service-btn:hover {
  background: #40a9ff;
}

.delete-btn {
  background: #ff4d4f;
  color: white;
}

.delete-btn:hover {
  background: #ff7875;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.service-item {
  background: #fafafa;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
  transition: transform 0.2s, box-shadow 0.2s;
}

.service-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.service-preview {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.service-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.service-placeholder {
  color: #999;
  font-size: 14px;
}

.service-content {
  padding: 16px;
}

.service-content h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #1a1a1a;
}

.service-description {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 13px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.service-actions {
  display: flex;
  gap: 8px;
}

.edit-service-btn,
.delete-service-btn {
  flex: 1;
  padding: 6px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 12px;
}

.edit-service-btn {
  background: #e6f7ff;
  color: #1890ff;
}

.edit-service-btn:hover {
  background: #bae7ff;
}

.delete-service-btn {
  background: #fff1f0;
  color: #ff4d4f;
}

.delete-service-btn:hover {
  background: #ffccc7;
}

.add-service-card {
  background: #f9f9f9;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #999;
  transition: all 0.2s;
}

.add-service-card:hover {
  border-color: #1890ff;
  color: #1890ff;
  background: #f6ffed;
}

.add-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-state h3 {
  margin: 0 0 12px 0;
  color: #1a1a1a;
}

.empty-state p {
  margin: 0 0 24px 0;
}
</style>