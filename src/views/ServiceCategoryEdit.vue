<template>
  <div class="category-edit">
    <div class="header">
      <button @click="goBack" class="back-btn">← 返回</button>
      <h1>{{ isEdit ? '编辑服务类别' : '添加服务类别' }}</h1>
    </div>

    <div class="edit-form">
      <form @submit.prevent="saveCategory">
        <div class="form-section">
          <h3>类别信息</h3>
          <div class="form-group">
            <label>类别名称:</label>
            <input v-model="currentCategory.name" type="text" required />
          </div>
          <div class="form-group">
            <label>类别描述:</label>
            <textarea v-model="currentCategory.description" required rows="4"></textarea>
          </div>
          <div class="form-group">
            <label>排序:</label>
            <input v-model.number="currentCategory.sort_order" type="number" />
          </div>
          <div class="form-group">
            <label>
              <input v-model="currentCategory.is_active" type="checkbox" />
              启用此类别
            </label>
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
import { serviceCategoryApi, type ServiceCategory } from '@/service/service'

const route = useRoute()
const router = useRouter()
const saving = ref(false)

const isEdit = computed(() => !!route.params.id)

const currentCategory = reactive<ServiceCategory>({
  name: '',
  description: '',
  sort_order: 0,
  is_active: true
})

const loadCategory = async () => {
  if (isEdit.value) {
    try {
      const id = Number(route.params.id)
      const response = await serviceCategoryApi.getOne(id)
      Object.assign(currentCategory, response.data)
    } catch (error) {
      console.error('Failed to load category:', error)
      alert('加载类别失败')
    }
  }
}

const saveCategory = async () => {
  try {
    saving.value = true
    
    if (isEdit.value) {
      await serviceCategoryApi.update(currentCategory.id!, currentCategory)
    } else {
      await serviceCategoryApi.create(currentCategory)
    }
    
    alert('保存成功')
    goBack()
  } catch (error) {
    console.error('Failed to save category:', error)
    alert('保存失败')
  } finally {
    saving.value = false
  }
}

const goBack = () => {
  router.push('/services')
}

onMounted(() => {
  loadCategory()
})
</script>

<style scoped>
.category-edit {
  padding: 20px;
  max-width: 800px;
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