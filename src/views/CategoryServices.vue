<template>
  <div class="category-services">
    <div class="header">
      <div class="nav">
        <button @click="goBack" class="back-btn">← 返回服务大类</button>
        <div class="breadcrumb">
          <span>服务大类管理</span>
          <span> / </span>
          <span>{{ categoryName }} - 服务管理</span>
        </div>
      </div>
      <button @click="addService" class="add-button">添加服务</button>
    </div>

    <div class="services-list">
      <div v-for="service in filteredServices" :key="service.id || service.name" class="service-card">
        <div class="service-header">
          <h3>{{ service.name }}</h3>
          <div class="actions">
            <button @click="editService(service)" class="edit-btn">编辑</button>
            <button 
              @click="deleteService(service.id!)" 
              class="delete-btn"
              :disabled="!service.id"
            >
              删除
            </button>
          </div>
        </div>
        <p class="description">{{ service.description }}</p>
        
        <!-- 显示详细说明 -->
        <div v-if="service.detailed_description" class="detailed-description">
          <h4>详细说明:</h4>
          <p>{{ service.detailed_description }}</p>
        </div>

        <!-- 显示服务图片 -->
        <div v-if="service.images && service.images.length > 0" class="service-images">
          <h4>服务图片:</h4>
          <div class="images-grid">
            <div v-for="(image, index) in service.images" :key="index" class="image-item">
              <img :src="image.url" :alt="image.description" />
              <p v-if="image.description" class="image-desc">{{ image.description }}</p>
            </div>
          </div>
        </div>

        <div class="meta">
          <span class="order">排序: {{ service.sort_order }}</span>
          <span :class="['status', service.is_active ? 'active' : 'inactive']">
            {{ service.is_active ? '启用' : '禁用' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { serviceApi, serviceCategoryApi, type ServiceItem } from '@/service/service'

const route = useRoute()
const router = useRouter()

const services = ref<ServiceItem[]>([])
const categoryName = ref('')

const categoryId = computed(() => Number(route.params.categoryId))

// 过滤出有效的服务数据
const filteredServices = computed(() => {
  return services.value.filter(service => 
    service && 
    typeof service === 'object' && 
    service.name && 
    service.description
  )
})

const loadCategory = async () => {
  try {
    const response = await serviceCategoryApi.getOne(categoryId.value)
    categoryName.value = response.data.name || '未知大类'
  } catch (error) {
    console.error('Failed to load service category:', error)
    categoryName.value = '未知大类'
  }
}

const loadServices = async () => {
  try {
    const response = await serviceApi.getByCategory(categoryId.value)
    console.log('Services response:', response)
    
    // 确保数据是数组格式
    if (response && response.data && Array.isArray(response.data)) {
      services.value = response.data
    } else if (response && Array.isArray(response)) {
      services.value = response
    } else {
      console.warn('Unexpected services data format:', response)
      services.value = []
    }
  } catch (error) {
    console.error('Failed to load services:', error)
    services.value = []
  }
}

const editService = (service: ServiceItem) => {
  router.push(`/service-categories/${categoryId.value}/services/edit/${service.id}`)
}

const addService = () => {
  router.push(`/service-categories/${categoryId.value}/services/add`)
}

const deleteService = async (id: number) => {
  if (!id) {
    alert('无效的服务ID')
    return
  }
  
  if (!confirm('确定要删除这个服务吗？')) return
  
  try {
    await serviceApi.delete(id)
    await loadServices()
  } catch (error) {
    console.error('Failed to delete service:', error)
    alert('删除失败')
  }
}

const goBack = () => {
  router.push('/service-categories')
}

onMounted(() => {
  loadCategory()
  loadServices()
})
</script>

<style scoped>
.category-services {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.back-btn {
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-start;
}

.back-btn:hover {
  background: #e6f7ff;
  border-color: #1890ff;
}

.breadcrumb {
  color: #666;
  font-size: 14px;
}

.add-button {
  background: #1890ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.services-list {
  display: grid;
  gap: 20px;
}

.service-card {
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 20px;
  background: white;
}

.service-header {
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

.detailed-description {
  margin-bottom: 15px;
}

.detailed-description h4 {
  margin-bottom: 8px;
  color: #262626;
  font-size: 16px;
}

.detailed-description p {
  color: #666;
  line-height: 1.6;
}

.service-images {
  margin-bottom: 15px;
}

.service-images h4 {
  margin-bottom: 12px;
  color: #262626;
  font-size: 16px;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.image-item {
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  overflow: hidden;
  background: #fafafa;
}

.image-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  display: block;
}

.image-desc {
  padding: 8px 12px;
  font-size: 13px;
  color: #666;
  margin: 0;
  border-top: 1px solid #e8e8e8;
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