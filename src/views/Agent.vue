<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
import { getAgentBrandList, addOrUpdateAgentBrand, deleteAgentBrand } from '../service/agent-brand'

interface Brand {
  id?: number
  name: string
  icon: string
}

const newBrand = reactive<Brand>({ name: '', icon: '' })
const formRef = ref<FormInstance>()
const drawerVisible = ref(false)
const brands = ref<Brand[]>([])
const isEdit = ref(false)
const editId = ref<number | null>(null)

const rules = {
  name: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }],
  icon: [{ required: true, message: '请上传品牌图标', trigger: 'change' }]
}

function beforeUpload(file: File) {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
  }
  return isImage
}

function openDrawer(brand?: Brand) {
  if (brand) {
    Object.assign(newBrand, brand)
    isEdit.value = true
    editId.value = brand.id!
  } else {
    newBrand.name = ''
    newBrand.icon = ''
    isEdit.value = false
    editId.value = null
  }
  drawerVisible.value = true
}

async function fetchBrands() {
  const res = await getAgentBrandList()
  if (res) {
    brands.value = res
  }
}

function handleUploadSuccess(response, file, fileList) {
  if (response && response.data) {
    newBrand.icon = response.data.url
  }
}

function addOrEditBrand() {
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const payload = { ...newBrand }
      if (isEdit.value && editId.value) {
        payload.id = editId.value
      }
      await addOrUpdateAgentBrand(payload)
      ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
      drawerVisible.value = false
      fetchBrands()
    }
  })
}

function handleEdit(brand: Brand) {
  openDrawer(brand)
}

function handleDelete(brand: Brand) {
  ElMessageBox.confirm('确定要删除该品牌吗？', '提示', { type: 'warning' })
    .then(async () => {
      await deleteAgentBrand(brand.id!)
      ElMessage.success('删除成功')
      fetchBrands()
    })
    .catch(() => {})
}

function resetForm() {
  formRef.value?.resetFields()
  newBrand.name = ''
  newBrand.icon = ''
  isEdit.value = false
  editId.value = null
}

onMounted(() => {
  fetchBrands()
})
</script>

<template>
  <div>
    <el-card>
      <h2>代理品牌列表</h2>
      <el-button type="primary" @click="openDrawer" style="margin-bottom: 16px;">新增品牌</el-button>
      <el-table :data="brands" style="width: 100%">
        <el-table-column prop="icon" label="图标" width="200">
          <template #default="scope">
            <img :src="scope.row.icon" alt="icon" width="40" height="40" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="品牌名称" />
        <el-table-column label="操作" width="300">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-drawer
      v-model="drawerVisible"
      :title="isEdit ? '编辑代理品牌' : '新增代理品牌'"
      size="400px"
      :with-header="true"
      @close="resetForm"
    >
      <el-form :model="newBrand" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="newBrand.name" placeholder="请输入品牌名称" />
        </el-form-item>
        <el-form-item label="品牌图标" prop="icon">
          <el-upload
            :before-upload="beforeUpload"
            accept="image/*"
            action="/api/files/upload"
            :on-success="handleUploadSuccess"
            list-type="picture"
          >
            <el-button type="primary">上传图片</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item class="fixed-bottom">
          <el-button type="primary" @click="addOrEditBrand">{{ isEdit ? '保存' : '新增' }}</el-button>
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