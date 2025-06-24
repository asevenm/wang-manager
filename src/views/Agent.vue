<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'

interface Brand {
  name: string
  icon: string // 图片URL或Base64
}

const brands = ref<Brand[]>([
  { name: '品牌A', icon: 'https://via.placeholder.com/40' },
  { name: '品牌B', icon: 'https://via.placeholder.com/40' }
])

const newBrand = reactive<Brand>({ name: '', icon: '' })
const formRef = ref<FormInstance>()
const drawerVisible = ref(false)

const rules = {
  name: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }],
  icon: [{ required: true, message: '请上传品牌图标', trigger: 'change' }]
}

function handleIconUpload(file: File) {
  const reader = new FileReader()
  reader.onload = (e) => {
    newBrand.icon = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

function beforeUpload(file: File) {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
  }
  return isImage
}

function openDrawer() {
  newBrand.name = ''
  newBrand.icon = ''
  drawerVisible.value = true
}

function addBrand() {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      brands.value.push({ ...newBrand })
      drawerVisible.value = false
      ElMessage.success('新增品牌成功')
    }
  })
}
</script>

<template>
  <div>
    <el-card>
      <h2>代理品牌列表</h2>
      <el-button type="primary" @click="openDrawer" style="margin-bottom: 16px;">新增品牌</el-button>
      <el-table :data="brands" style="width: 100%">
        <el-table-column prop="icon" label="图标" width="60">
          <template #default="scope">
            <img :src="scope.row.icon" alt="icon" width="40" height="40" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="品牌名称" />
      </el-table>
    </el-card>

    <el-drawer
      v-model="drawerVisible"
      title="新增代理品牌"
      size="400px"
      :with-header="true"
    >
      <el-form :model="newBrand" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="newBrand.name" placeholder="请输入品牌名称" />
        </el-form-item>
        <el-form-item label="品牌图标" prop="icon">
          <el-upload
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-change="file => handleIconUpload(file.raw)"
            accept="image/*"
          >
            <el-button type="primary">上传图片</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item class="fixed-bottom">
          <el-button type="primary" @click="addBrand">新增</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<style scoped>
.el-card {
  margin-bottom: 24px;
}
.fixed-bottom {
  position: fixed;
  bottom: 0;
  background: #fff;
  width: 400px;
  right: 0;
  margin-bottom: 0;
  padding: 16px;
  box-sizing: border-box;
}
</style>