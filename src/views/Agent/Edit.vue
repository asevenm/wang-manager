<template>
  <div class="page-container">
    <!-- 返回按钮 -->
    <el-button @click="handleBack" class="back-button">
      <el-icon><ArrowLeft /></el-icon>
      返回
    </el-button>

    <el-card>
      <template #header>
        <h2>编辑代理品牌</h2>
      </template>

      <div v-if="brandDetail">
        <Form :initValue="brandDetail" :onSuccess="onSuccess" />
      </div>
      <div v-else class="loading">
        <el-loading></el-loading>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import Form from './Form.vue'
import { getAgentBrandList } from '../../service/agent-brand'

interface Brand {
  id?: number
  name: string
  icon: string
}

const route = useRoute()
const router = useRouter()
const brandDetail = ref<Brand | null>(null)

function handleBack() {
  router.back()
}

function onSuccess() {
  router.back()
}

async function fetchBrandDetail(id: string) {
  try {
    // 由于没有单独获取单个品牌的API，从列表中查找
    const brands = await getAgentBrandList()
    if (brands) {
      const brand = brands.find((item: Brand) => item.id === Number(id))
      if (brand) {
        brandDetail.value = brand
      } else {
        ElMessage.error('品牌不存在')
        router.back()
      }
    }
  } catch (error) {
    ElMessage.error('获取品牌信息失败')
    console.error('Fetch brand detail error:', error)
    router.back()
  }
}

onMounted(async () => {
  const brandId = route.params.id as string
  if (brandId) {
    await fetchBrandDetail(brandId)
  }
})
</script>

<style scoped>
.page-container {
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  padding-bottom: 100px;
}

.back-button {
  margin-bottom: 16px;
  position: fixed;
  top: 80px;
  left: 10px;
  z-index: 100;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}
</style>