<template>
  <div style="width: 260px; padding-right: 18px">
    <el-tree
      style="width: 242px"
      :data="props.typeTree"
      :props="defaultProps"
      defaultExpandAll
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <el-dropdown>
            <a class="el-dropdown-link">
              ...
            </a>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click.prevent="handleEdit(data)">编辑</el-dropdown-item>
                <el-dropdown-item @click.prevent="handleAddChild(data)">添加子分类</el-dropdown-item>
                <el-dropdown-item @click.prevent="handleDelete(data)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </span>
      </template>
    </el-tree>
    <AddType :typeInfo="editNode" :addSub="addSub" @close="handleClose" @fetchTypes="getTypes" ref="childRef" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import AddType from './AddType.vue';
import { deleteType } from '../../service/instrument';
import { ElMessage } from 'element-plus';

export interface Tree {
  name: string
  children?: Tree[]
  id: number;
}

const props = defineProps<{ typeTree: Tree, fetchTypes: () => void }>();
const editNode = ref();
const addSub = ref(false);

const emit = defineEmits(['fetchTypes']);
const getTypes = () => {
  emit('fetchTypes');
}

const handleEdit = (node) => {
  editNode.value = node;
  childRef.value.openDialog();
}

const handleAddChild = (node) => {
  editNode.value = node;
  addSub.value = true;
  childRef.value.openDialog();
}

const handleDelete = (node) => {
  deleteType(node.id).then((res) => {
    if (res) {
      ElMessage.success('删除成功');
      emit('fetchTypes');
    }
  })
}

const handleClose = () => {
  editNode.value = undefined;
  addSub.value = false;
}

const childRef = ref();

const defaultProps = {
  children: 'children',
  label: 'name',
}
</script>

<style>
.el-dropdown-link {
  font-size: 24px;
  margin: auto 8px;
}
.custom-tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
</style>
