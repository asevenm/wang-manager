<template>
  <div class="service-edit">
    <div class="header">
      <button @click="goBack" class="back-btn">← 返回</button>
      <h1>{{ isEdit ? '编辑服务' : '添加服务' }}</h1>
    </div>

    <div class="edit-form">
      <form @submit.prevent="saveService">
        <div class="form-section">
          <h3>基本信息</h3>
          <div class="form-group">
            <label>服务类别:</label>
            <select v-model="currentService.category_id" required>
              <option value="">请选择服务类别</option>
              <option 
                v-for="category in categories" 
                :key="category.id" 
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>服务名称:</label>
            <input v-model="currentService.name" type="text" required />
          </div>
          <div class="form-group">
            <label>简短描述:</label>
            <textarea v-model="currentService.description" required rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>详细说明:</label>
            <textarea 
              v-model="currentService.detailed_description" 
              placeholder="请详细描述此服务的内容、特点、适用场景等..."
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
        </div>

        <div class="form-section">
          <h3>服务图片</h3>
          <div class="images-section">
            <div 
              v-for="(image, index) in currentService.images || []" 
              :key="index" 
              class="image-item"
            >
              <div class="image-preview">
                <img v-if="image.url" :src="image.url" :alt="image.description" />
                <div v-else class="image-placeholder">
                  <span>暂无图片</span>
                </div>
              </div>
              <div class="image-controls">
                <input 
                  type="file" 
                  @change="handleImageUpload($event, index)"
                  accept="image/*"
                  class="file-input"
                  :id="`image-${index}`"
                />
                <label :for="`image-${index}`" class="upload-btn">选择图片</label>
                <button type="button" @click="removeImage(index)" class="remove-btn">删除</button>
              </div>
              <div class="form-group">
                <label>图片说明:</label>
                <textarea 
                  v-model="image.description" 
                  placeholder="请输入图片说明"
                  rows="3"
                ></textarea>
              </div>
            </div>
            <button type="button" @click="addImage" class="add-image-btn">+ 添加图片</button>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="goBack" class="cancel-btn">取消</button>
          <button type="submit" class="save-btn" :disabled="saving">
            {{ saving ? '保存中...' : '保存' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { serviceCategoryApi, serviceApi, type ServiceCategory, type ServiceItem, type ServiceImage } from '@/service/service'

const route = useRoute()
const router = useRouter()
const saving = ref(false)

const isEdit = computed(() => !!route.params.id)
const categories = ref<ServiceCategory[]>([])

const currentService = reactive<ServiceItem>({
  name: '',
  description: '',
  detailed_description: '',
  category_id: 0,
  sort_order: 0,
  is_active: true,
  images: []
})

const loadCategories = async () => {
  try {
    const response = await serviceCategoryApi.getAll()
    categories.value = response.data
    
    // 如果是添加模式且URL中有category参数，自动选择该类别
    if (!isEdit.value && route.query.category) {
      currentService.category_id = Number(route.query.category)
    }
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

const loadService = async () => {
  if (isEdit.value) {
    try {
      const id = Number(route.params.id)
      const response = await serviceApi.getOne(id)
      Object.assign(currentService, response.data)
      
      // 确保images数组存在
      if (!currentService.images) {
        currentService.images = []
      }
    } catch (error) {
      console.error('Failed to load service:', error)
      alert('加载服务失败')
    }
  }
}

const addImage = () => {
  currentService.images!.push({
    url: '',
    description: ''
  })
}

const removeImage = (index: number) => {
  currentService.images!.splice(index, 1)
}

const handleImageUpload = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    // 创建预览URL
    const reader = new FileReader()
    reader.onload = (e) => {
      currentService.images![index].url = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const saveService = async () => {
  try {
    saving.value = true
    
    // 准备保存的数据
    const serviceData = {
      ...currentService,
      images: currentService.images?.map((img: ServiceImage) => ({
        url: img.url,
        description: img.description
      })) || []
    }

    if (isEdit.value) {
      await serviceApi.update(currentService.id!, serviceData)
    } else {
      await serviceApi.create(serviceData)
    }
    
    alert('保存成功')
    goBack()
  } catch (error) {
    console.error('Failed to save service:', error)
    alert('保存失败')
  } finally {
    saving.value = false
  }
}

const goBack = () => {
  router.push('/services')
}

onMounted(async () => {
  await Promise.all([loadCategories(), loadService()])
})
</script>

<style scoped>
.service-edit {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.back-btn {
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.back-btn:hover {
  background: #e6f7ff;
  border-color: #1890ff;
}

.edit-form {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.form-section:last-of-type {
  border-bottom: none;
}

.form-section h3 {
  margin: 0 0 16px 0;
  color: #262626;
  font-size: 18px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: #262626;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
}

.form-group input[type="checkbox"] {
  margin-right: 8px;
}

.images-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.image-item {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fafafa;
}

.image-preview {
  width: 200px;
  height: 150px;
  border: 2px dashed #d9d9d9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.image-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.image-placeholder {
  color: #999;
  font-size: 14px;
}

.image-controls {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin-bottom: 12px;
}

.file-input {
  display: none;
}

.upload-btn {
  background: #1890ff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.upload-btn:hover {
  background: #40a9ff;
}

.remove-btn {
  background: #ff4d4f;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.remove-btn:hover {
  background: #ff7875;
}

.add-image-btn {
  background: #52c41a;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-start;
  font-size: 14px;
}

.add-image-btn:hover {
  background: #73d13d;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #d9d9d9;
  padding: 10px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-btn:hover {
  background: #e6f7ff;
  border-color: #1890ff;
}

.save-btn {
  background: #1890ff;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.save-btn:hover:not(:disabled) {
  background: #40a9ff;
}

.save-btn:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
}
</style>