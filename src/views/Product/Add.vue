<template>
  <div style="z-index: 100; width: 80%; margin: 0 auto; padding-bottom: 100px;">
    <!-- 返回 -->
    <el-button @click="handleBack" style="margin-bottom: 16px; position: fixed; top: 80px; left: 10px;">返回</el-button>
    <Form :types="props.types" :onSuccess="onSuccess" :initValue="props.detail" />
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import Form from './Form.vue';
import type { RuleForm } from './type';
import type { Tree } from './Types.vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const props = withDefaults(defineProps<{
  type: 'create' | 'edit'
  detail?: RuleForm
  types: Tree[]
}>(), {
  type: 'create'
});

const onSuccess = () => {
  router.back()
  ElMessage(props.type === 'create' ? '添加成功' : '编辑成功');
}

const handleBack = () => {
  router.back()
}
</script>

<style>
.create {
  margin: 16px 0;
}
.edit {
  margin-right: 8px;
}
</style>
