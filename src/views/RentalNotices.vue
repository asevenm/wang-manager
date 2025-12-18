<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { rentalApi } from '../service/rental';
import { ElMessage } from 'element-plus';
import RichTextEditor from '../components/RichTextEditor.vue';

const notices = ref<any[]>([]);
const loading = ref(false);

const DEFAULT_TITLES = [
  '关于押金', '服务内容', '关于租期', '货物取送', '关于续租',
  '租金退换', '质量保证', '提前归还', '取消订单'
];

const fetchNotices = async () => {
  loading.value = true;
  try {
    const data = await rentalApi.getNotices();
    if (data.length === 0) {
      // Seed with default titles if empty
      notices.value = DEFAULT_TITLES.map((title, index) => ({
        title,
        content: '',
        image_url: '',
        sort_order: index
      }));
    } else {
      notices.value = data;
    }
  } catch (error) {
    ElMessage.error('获取租赁须知失败');
  } finally {
    loading.value = false;
  }
};

const handleSave = async () => {
  try {
    await rentalApi.updateAllNotices(notices.value);
    ElMessage.success('保存成功');
    fetchNotices(); // Refresh to get IDs
  } catch (error) {
    ElMessage.error('保存失败');
  }
};

onMounted(fetchNotices);
</script>

<template>
  <div class="rental-notices">
    <div class="header">
      <h2>租赁须知管理</h2>
      <el-button type="primary" @click="handleSave" :loading="loading">全部保存</el-button>
    </div>

    <el-collapse v-loading="loading">
      <el-collapse-item v-for="(item, index) in notices" :key="index" :title="item.title" :name="index">
        <div class="notice-edit">
          <el-form label-width="80px">
            <el-form-item label="标题">
              <el-input v-model="item.title" />
            </el-form-item>
            <el-form-item label="图片链接">
              <el-input v-model="item.image_url" placeholder="请输入图片URL或上传">
                <template #append>
                  <el-button>上传(待实)</el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="内容">
              <RichTextEditor v-model="item.content" />
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.notice-edit {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 4px;
}
</style>
