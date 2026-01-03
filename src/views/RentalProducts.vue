<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { rentalApi } from '../service/rental';
import { ElMessage, ElMessageBox } from 'element-plus';
import RichTextEditor from '../components/RichTextEditor.vue';

// 固定的须知标题
const NOTICE_KEYS = [
  { key: 'deposit', title: '关于押金' },
  { key: 'service', title: '服务内容' },
  { key: 'rental_period', title: '关于租期' },
  { key: 'delivery', title: '货物取送' },
  { key: 'renewal', title: '关于续租' },
  { key: 'refund', title: '租金退换' },
  { key: 'quality', title: '质量保证' },
  { key: 'early_return', title: '提前归还' },
  { key: 'cancel', title: '取消订单' },
];

const products = ref<any[]>([]);
const loading = ref(false);
const expandedProductId = ref<number | null>(null);

// 初始化空的须知对象
const createEmptyNotices = () => {
  const notices: Record<string, string> = {};
  NOTICE_KEYS.forEach(item => {
    notices[item.key] = '';
  });
  return notices;
};

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
    // 确保 notices 字段存在
    if (!row.notices) {
      row.notices = createEmptyNotices();
    }
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
    notices: createEmptyNotices(),
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

// 展开/收起须知编辑
const toggleNotices = (row: any) => {
  if (expandedProductId.value === row.id) {
    expandedProductId.value = null;
  } else {
    // 确保 notices 对象存在
    if (!row.notices) {
      row.notices = createEmptyNotices();
    }
    expandedProductId.value = row.id;
  }
};

// 保存须知
const handleSaveNotices = async (row: any) => {
  try {
    await rentalApi.updateProduct(row.id, { notices: row.notices });
    ElMessage.success('须知保存成功');
  } catch (error) {
    ElMessage.error('须知保存失败');
  }
};

onMounted(fetchProducts);
</script>

<template>
  <div class="rental-products">
    <div class="header">
      <h2>租赁产品管理</h2>
      <el-button type="primary" @click="handleAdd">添加产品</el-button>
    </div>

    <el-table :data="products" v-loading="loading" style="width: 100%" row-key="id">
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
          <span v-else>{{ row.day3_price }}</span>
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
      <el-table-column label="备注" min-width="120">
        <template #default="{ row }">
          <el-input v-if="row.isEditing" v-model="row.remarks" type="textarea" autosize />
          <span v-else>{{ row.remarks }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row, $index }">
          <template v-if="row.isEditing">
            <el-button link type="primary" @click="handleSave(row)">保存</el-button>
            <el-button link @click="row.isEditing = false; if(!row.id) products.splice($index,1)">取消</el-button>
          </template>
          <template v-else>
            <el-button link type="primary" @click="row.isEditing = true">编辑</el-button>
            <el-button link type="primary" @click="toggleNotices(row)">
              {{ expandedProductId === row.id ? '收起须知' : '编辑须知' }}
            </el-button>
            <el-button link type="danger" @click="handleDelete(row, $index)">删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 须知编辑区域 -->
    <template v-for="product in products" :key="'notices-' + product.id">
      <div v-if="expandedProductId === product.id && product.id" class="notices-panel">
        <div class="notices-header">
          <h3>{{ product.name }} - 租赁须知</h3>
          <div>
            <el-button type="primary" @click="handleSaveNotices(product)">保存须知</el-button>
            <el-button @click="expandedProductId = null">收起</el-button>
          </div>
        </div>
        <el-collapse>
          <el-collapse-item
            v-for="notice in NOTICE_KEYS"
            :key="notice.key"
            :title="notice.title"
            :name="notice.key"
          >
            <RichTextEditor
              v-model="product.notices[notice.key]"
              height="200px"
              :placeholder="`请输入${notice.title}的内容...`"
            />
          </el-collapse-item>
        </el-collapse>
      </div>
    </template>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.notices-panel {
  margin-top: 20px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.notices-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.notices-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

:deep(.el-collapse-item__header) {
  font-weight: 500;
  font-size: 14px;
}

:deep(.el-collapse-item__content) {
  padding: 16px 0;
}
</style>
