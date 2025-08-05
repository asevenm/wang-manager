<template>
  <div class="services-management">
    <div class="header">
      <h1>服务管理</h1>
      <button @click="showAddModal = true" class="add-button">添加服务</button>
    </div>

    <div class="services-list">
      <div v-for="service in services" :key="service.id" class="service-card">
        <div class="service-header">
          <h3>{{ service.title }}</h3>
          <div class="actions">
            <button @click="editService(service)" class="edit-btn">编辑</button>
            <button @click="deleteService(service.id!)" class="delete-btn">删除</button>
          </div>
        </div>
        <p class="description">{{ service.description }}</p>
        <div class="features">
          <h4>服务内容:</h4>
          <ul>
            <li v-for="(feature, index) in service.features" :key="index">{{ feature }}</li>
          </ul>
        </div>
        <div class="meta">
          <span class="order">排序: {{ service.sort_order }}</span>
          <span :class="['status', service.is_active ? 'active' : 'inactive']">
            {{ service.is_active ? '启用' : '禁用' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ showAddModal ? '添加服务' : '编辑服务' }}</h2>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        <form @submit.prevent="saveService" class="modal-form">
          <div class="form-group">
            <label>服务标题:</label>
            <input v-model="currentService.title" type="text" required />
          </div>
          <div class="form-group">
            <label>服务描述:</label>
            <textarea v-model="currentService.description" required></textarea>
          </div>
          <div class="form-group">
            <label>服务内容 (每行一项):</label>
            <textarea 
              v-model="featuresText" 
              placeholder="每行输入一个服务内容"
              rows="8"
            ></textarea>
          </div>
          <div class="form-group">
            <label>排序:</label>
            <input v-model.number="currentService.sort_order" type="number" />
          </div>
          <div class="form-group">
            <label>
              <input v-model="currentService.is_active" type="checkbox" />
              启用此服务
            </label>
          </div>
          <div class="form-actions">
            <button type="button" @click="closeModal" class="cancel-btn">取消</button>
            <button type="submit" class="save-btn">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { serviceApi, type ServiceItem } from '@/service/service'

const services = ref<ServiceItem[]>([])
const showAddModal = ref(false)
const showEditModal = ref(false)
const currentService = reactive<ServiceItem>({
  title: '',
  description: '',
  features: [],
  sort_order: 0,
  is_active: true
})

const featuresText = computed({
  get: () => currentService.features.join('\n'),
  set: (value: string) => {
    currentService.features = value.split('\n').filter(f => f.trim())
  }
})

const loadServices = async () => {
  try {
    const { data } = await serviceApi.getAll()
    services.value = data || []
  } catch (error) {
    console.error('Failed to load services:', error)
  }
}

const editService = (service: ServiceItem) => {
  Object.assign(currentService, service)
  showEditModal.value = true
}

const deleteService = async (id: number) => {
  if (!confirm('确定要删除这个服务吗？')) return
  
  try {
    await serviceApi.delete(id)
    await loadServices()
  } catch (error) {
    console.error('Failed to delete service:', error)
    alert('删除失败')
  }
}

const saveService = async () => {
  try {
    if (showAddModal.value) {
      await serviceApi.create(currentService)
    } else {
      await serviceApi.update(currentService.id!, currentService)
    }
    await loadServices()
    closeModal()
  } catch (error) {
    console.error('Failed to save service:', error)
    alert('保存失败')
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  Object.assign(currentService, {
    title: '',
    description: '',
    features: [],
    sort_order: 0,
    is_active: true
  })
}

onMounted(() => {
  loadServices()
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

.description {
  margin-bottom: 15px;
  color: #666;
}

.features {
  margin-bottom: 15px;
}

.features h4 {
  margin-bottom: 8px;
}

.features ul {
  margin: 0;
  padding-left: 20px;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.modal-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-group textarea {
  resize: vertical;
  min-height: 60px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #d9d9d9;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn {
  background: #1890ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
</style>