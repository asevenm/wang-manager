<template>
  <div style="z-index: 100; width: 80%; margin: 0 auto; padding-bottom: 100px;">
    <!-- 返回 -->
    <el-button @click="handleBack" style="margin-bottom: 16px; position: fixed; top: 80px; left: 10px;">返回</el-button>
    <div v-if="detail">
      <Form :initValue="detail" :types="types" :onSuccess="onSuccess" />
    </div>
    <div v-else class="loading">
      <el-loading></el-loading>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import Form from './Form.vue';
import { getTypes } from '../../service/instrument';
import type { RuleForm } from './type';
import type { Tree } from './Types.vue';
import { getInstrumentDetail } from '../../service/instrument';

const route = useRoute();
const router = useRouter();
const detail = ref<RuleForm | null>(null);
const types = ref<Tree[]>([]);

const fetchTypes = async () => {
  try {
    const res = await getTypes();
    types.value = res;
  } catch (error) {
    console.error('Failed to fetch types:', error);
  }
};

const fetchProductDetail = async (id: string) => {
  getInstrumentDetail(Number(id)).then((res) => {
    console.log(res);
    detail.value = {
      ...res,
      typeId: res.type.id,
    };
  }); 
};

const onSuccess = () => {
  router.back();
  ElMessage('编辑成功');
};

const handleBack = () => {
  router.back();
};

onMounted(async () => {
  await fetchTypes();
  const productId = route.params.id as string;
  if (productId) {
    await fetchProductDetail(productId);
  }
});
</script>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}
</style>