<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAgentBrandList, deleteAgentBrand } from '../service/agent-brand'

interface Brand {
  id?: number
  name: string
  icon: string
}

const router = useRouter()
const brands = ref<Brand[]>([])

async function fetchBrands() {
  const res = await getAgentBrandList()
  if (res) {
    brands.value = res
  }
}

function handleAdd() {
  router.push('/agent/add')
}

function handleEdit(brand: Brand) {
  router.push(`/agent/edit/${brand.id}`)
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

onMounted(() => {
  fetchBrands()
})
</script>

<template>
  <div>
    <el-card>
      <h2>代理品牌列表</h2>
      <el-button type="primary" @click="handleAdd" style="margin-bottom: 16px;">新增品牌</el-button>
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
  </div>
</template>

<style scoped>
.el-card {
  margin-bottom: 24px;
}
</style>