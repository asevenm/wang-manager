<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { rentalApi } from '../service/rental';
import { ElMessage, ElMessageBox } from 'element-plus';

const products = ref<any[]>([]);
const loading = ref(false);

const fetchProducts = async () => {
  loading.value = true;
  try {
    products.value = await rentalApi.getProducts();
  } catch (error) {
    ElMessage.error('获取产品列表失败');
  } finally {
    loading.value = false;
  }
};

const handleSave = async (row: any) => {
  try {
    if (row.id) {
      await rentalApi.updateProduct(row.id, row);
      ElMessage.success('更新成功');
    } else {
      const resp = await rentalApi.createProduct(row);
      row.id = resp.id;
      ElMessage.success('创建成功');
    }
    row.isEditing = false;
  } catch (error) {
    ElMessage.error('保存失败');
  }
};

const handleAdd = () => {
  products.value.push({
    name: '',
    day1_price: 0,
    day2_price: 0,
    day3_price: 0,
    day4_price: 0,
    deposit: 0,
    status: 'available',
    remarks: '',
    isEditing: true
  });
};

const handleDelete = (row: any, index: number) => {
  if (!row.id) {
    products.value.splice(index, 1);
    return;
  }
  ElMessageBox.confirm('确定要删除该产品吗？', '警告', {
    type: 'warning'
  }).then(async () => {
    try {
      await rentalApi.deleteProduct(row.id);
      products.value.splice(index, 1);
      ElMessage.success('删除成功');
    } catch (error) {
      ElMessage.error('删除失败');
    }
  });
};

onMounted(fetchProducts);
</script>

<template>
  <div class="rental-products">
    <div class="header">
      <h2>租赁产品管理</h2>
      <el-button type="primary" @click="handleAdd">添加产品</el-button>
    </div>

    <el-table :data="products" v-loading="loading" style="width: 100%">
      <el-table-column label="产品名称" min-width="150">
        <template #default="{ row }">
          <el-input v-if="row.isEditing" v-model="row.name" placeholder="请输入名称" />
          <span v-else>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="首日价格" width="100">
        <template #default="{ row }">
          <el-input-number v-if="row.isEditing" v-model="row.day1_price" :precision="2" :step="0.1" :controls="false" />
          <span v-else>{{ row.day1_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="次日价格" width="100">
        <template #default="{ row }">
          <el-input-number v-if="row.isEditing" v-model="row.day2_price" :precision="2" :step="0.1" :controls="false" />
          <span v-else>{{ row.day2_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="第三天" width="100">
        <template #default="{ row }">
          <el-input-number v-if="row.isEditing" v-model="row.day3_price" :precision="2" :step="0.1" :controls="false" />
          <span v-else>{{ row.day1_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="第四天" width="100">
        <template #default="{ row }">
          <el-input-number v-if="row.isEditing" v-model="row.day4_price" :precision="2" :step="0.1" :controls="false" />
          <span v-else>{{ row.day4_price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="质保金" width="100">
        <template #default="{ row }">
          <el-input-number v-if="row.isEditing" v-model="row.deposit" :precision="2" :step="10" :controls="false" />
          <span v-else>{{ row.deposit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-select v-if="row.isEditing" v-model="row.status">
            <el-option label="在租" value="available" />
            <el-option label="下架" value="unavailable" />
          </el-select>
          <el-tag v-else :type="row.status === 'available' ? 'success' : 'info'">
            {{ row.status === 'available' ? '在租' : '下架' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template #default="{ row }">
          <el-input v-if="row.isEditing" v-model="row.remarks" type="textarea" autosize />
          <span v-else>{{ row.remarks }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row, $index }">
          <template v-if="row.isEditing">
            <el-button link type="primary" @click="handleSave(row)">保存</el-button>
            <el-button link @click="row.isEditing = false; if(!row.id) products.splice($index,1)">取消</el-button>
          </template>
          <template v-else>
            <el-button link type="primary" @click="row.isEditing = true">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(row, $index)">删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
