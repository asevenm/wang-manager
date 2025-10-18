<template>
  <div class="page-container">
    <!-- 返回按钮 -->
    <el-button @click="handleBack" class="back-button">
      <el-icon><ArrowLeft /></el-icon>
      返回
    </el-button>

    <el-card>
      <template #header>
        <h2>新增代理品牌</h2>
      </template>

      <Form :onSuccess="onSuccess" />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import Form from './Form.vue'

const router = useRouter()

function handleBack() {
  router.back()
}

function onSuccess() {
  router.back()
}
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
</style>