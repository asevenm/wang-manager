<template>
  <div style="z-index: 100">
    <!-- <el-button :size="size" type="primary" :class="className" @click="onClick">
      {{props.buttonText}}
    </el-button> -->
    <el-drawer
      v-model="drawer"
      :title="title"
      :direction="direction"
      size="740"
      :beforeClose="handleBeforeClose"
    >
      <Form :types="props.types" :onSuccess="onSuccess" />
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { DrawerProps } from 'element-plus'
import Form from './Form.vue';
import type { RuleForm } from './type';
import type { Tree } from './Types.vue';

const props = withDefaults(defineProps<{
  type: 'create' | 'edit'
  buttonText: string
  detail?: RuleForm
  types: Tree[]
  onClick?: () => void
  onSuccess: () => void;
  onCancel: () => void;
}>(), {
  type: 'create'
});

const title = computed(() => {
  return props.type === 'create' ? '新增产品' : '编辑产品';
})

const drawer = ref(false)
const direction = ref<DrawerProps['direction']>('rtl')

const handleBeforeClose = () => {
  drawer.value = false;
  props.onCancel();
}

defineExpose({
  open: () => drawer.value = true,
});

const onSuccess = () => {
  props.onSuccess && props.onSuccess()
  ElMessage(props.type === 'create' ? '添加成功' : '编辑成功');
  drawer.value = false;
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
