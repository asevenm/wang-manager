<script lang="ts" setup>
import { ref, reactive, watch, computed } from 'vue';
import { createType } from '../../service/instrument';
import type { Tree } from './Types.vue';

const props = defineProps<{ typeInfo?: Tree, addSub?: boolean }>()

const dialogFormVisible = ref(false)
const formLabelWidth = '100px'

const openDialog = () => {
  dialogFormVisible.value = true;
}

defineExpose({ openDialog });

const emit = defineEmits(['fetchTypes', 'close']);

const form = reactive<{ name: string, type: string; child?: string, id?: number }>({
  name: '',
  type: '',
  child: '',
});

watch(() => props.typeInfo, (value) => {
  form.name = value?.name || '';
  form.type = value?.type || '';
});

// const hasFirstLevel = computed(() => !!props.typeInfo?.name);
const title = computed(() => {
  if (props.addSub) return '添加子类型';
  if (props.typeInfo?.name) return '编辑类型';
  return '添加类型'
});

const handleConfirm = () => {
  let params: { name: string; type: string; id?: number; parentId?: number } = { name: form.name, type: form.type, id: props.typeInfo?.id };
  if (props.addSub) {
    params = { name: form.child, type: form.type, parentId: props.typeInfo?.id };
  }
  createType(params).then((res) => {
    if (res) {
      dialogFormVisible.value = false;
      emit('fetchTypes');
    }
  }); 
}

const onClose = () => {
  emit('close');
  form.child = undefined;
  form.name = undefined;
}

// const removeChild = (child) => {
//   const index = form.children.findIndex((i) => i === child);
//   form.children.splice(index, 1);
// }

// const addChild = () => {
//   form.children.push({ name: '' });
// }
</script>

<template>
  <div>
    <el-button type="primary" @click="dialogFormVisible = true" style="margin-top: 16px">
      新增分类
    </el-button>

    <el-dialog
      close-on-click-modal
      close-on-press-escape
      v-model="dialogFormVisible"
      :title="title"
      width="500"
      @close="onClose"
    >
      <el-form :model="form">
        <el-form-item
          label="名称"
          :label-width="formLabelWidth"
          :rules="{
            required: true,
            message: '名称不能为空',
            trigger: 'blur',
          }"
        >
          <el-input v-model="form.name" autocomplete="off" :disabled="props.addSub" />
        </el-form-item>
        <el-form-item
          label="类型"
          :label-width="formLabelWidth"
          :rules="{
            required: true,
            message: '类型不能为空',
            trigger: 'blur',
          }"
        >
          <el-select v-model="form.type" placeholder="请选择类型" :disabled="props.addSub">
            <el-option label="仪器设备" value="1" />
            <el-option label="试剂耗材" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-show="addSub"
          label="子分类"
          :label-width="formLabelWidth"
          :rules="{
            required: true,
            message: '子分类不能为空',
            trigger: 'blur',
          }"
        >
          <el-input v-model="form.child" autocomplete="off" />
        </el-form-item>
        <!-- <el-form-item
          :label-width="formLabelWidth"
          v-for="(child, index) in form.children"
          :key="child.key"
          :label="'二级类型' + index"
          :prop="'children.' + index + '.name'"
          :rules="{
            required: true,
            message: '二级类型不能为空',
            trigger: 'blur',
          }"
        >
          <el-row>
            <el-col :span="20">
              <el-input v-model="child.name" />
            </el-col>
            <el-col :span="4">
              <el-button type="danger" style="margin-left: 8px" class="mt-2" @click.prevent="removeChild(child)">
                删除
              </el-button>
            </el-col>
          </el-row>
        </el-form-item> -->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirm">
            确定
          </el-button>
          <!-- <el-button v-show="hasFirstLevel" @click="addChild">添加二级类型</el-button> -->
        </div>
      </template>
    </el-dialog>
  </div>
</template>