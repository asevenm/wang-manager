<script lang="ts" setup>
import { reactive, ref, onBeforeMount, provide } from 'vue';
import type { Ref } from 'vue';
import { ElMessage } from 'element-plus';
import Add from './Add.vue';
import Types from './Types.vue';
import { getList, deleteInstrument, getTypes } from '../../service/instrument';
import type { Instrument } from './type';
import { formatDate } from '../../utils';


const searchData = reactive({
  name: undefined,
  type: undefined,
})

const tableData = ref({
  list: [],
  currentPage: 1,
  total: 0,
  pageSize: 10,
});

const page = ref({
  currentPage: 1,
  pageSize: 10,
});

const typeTree = ref([]);

const mode = ref('create');

const fetchTypes = () => {
  getTypes().then((res) => {
    typeTree.value = res;
  });
}

// fetchTypes();

const editRow = ref();

const addRef = ref(null);

const fetchData = () => {
  getList({ ...searchData, page: page.value }).then((res) => {
    tableData.value = res
  });
}

// fetchData();

onBeforeMount(() => {
  fetchTypes();
  fetchData();
})

const onSubmit = () => {
  fetchData()
}

const handleCurrentChange = (curr: number) => {
  page.value.currentPage = curr;
  fetchData()
}

const handleEdit = (row: Instrument) => {
  editRow.value = { ...row, typeId: row.type.id };
  mode.value = 'edit';
  addRef.value.open();
}

const handleDelete = (id: number) => {
  deleteInstrument(id).then((res) => {
    if (res) {
      fetchData();
      ElMessage('删除成功');
    }
  })
}

const onSuccess = () => {
  fetchData();
  mode.value = 'create';
  editRow.value = undefined;
}

const handleClick = () => {
  mode.value = 'create';
  addRef.value.open();  
}

const onCancel = () => {
  mode.value = 'create';
  editRow.value = undefined;
}

provide<Ref<Instrument>>('editRow', editRow);
</script>

<template>
  <div class="instrument">
    <Types :typeTree="typeTree" @fetchTypes="fetchTypes" />
    <div className="list">
      <el-form :inline="true" :model="searchData" style="text-align: left">
        <el-form-item label="名称">
          <el-input v-model="searchData.name" placeholder="请输入" clearable style="width: 200px" />
        </el-form-item>
        <!-- <el-form-item label="类型">
          <el-select
            v-model="searchData.type"
            placeholder="请选择"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="item in pages"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="handleClick">新增产品</el-button>
      <el-table :data="tableData.list" style="width: 100%" v-loading="isFetching">
        <el-table-column prop="name" label="名称" />
        <el-table-column label="类型">
          <template #default="scope">
            <time>{{ scope.row.type?.name }}</time>
          </template>
        </el-table-column>
        <el-table-column label="功能">
          <template #default="scope">
            <time>{{ scope.row.features.map((item) => item.text).join(', ') }}</time>
          </template>
        </el-table-column>
        <el-table-column label="型号">
          <template #default="scope">
            <time>{{ scope.row.models.map((item) => item.name).join(', ') }}</time>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template #default="scope">
            <time>{{ formatDate(scope.row.createTime) }}</time>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="创建人" />
        <el-table-column prop="region" label="产地" />
        <el-table-column label="操作">
          <template #default="scope">
            <div style="display: flex">
              <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.row.id)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :current-page="tableData.currentPage"
        :page-size="tableData.pageSize"
        layout="prev, pager, next"
        :total="tableData.total"
        @current-change="handleCurrentChange"
        class="pagination"
      />
      <Add
        :type="mode"
        :detail="editRow"
        :onSuccess="onSuccess"
        :types="typeTree"
        ref="addRef"
        :onCancel="onCancel"
      />
    </div>
  </div>
</template>

<style>
.instrument {
  display: flex;
}
.instrument .list {
  flex: 1;
}
</style>