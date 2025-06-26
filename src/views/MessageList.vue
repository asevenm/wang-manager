<template>
  <div class="message-list-container">
    <div class="search-form">
      <el-form :model="searchForm" ref="searchFormRef" :inline="true">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="searchForm.email" placeholder="请输入邮箱" clearable />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="searchForm.phone" placeholder="请输入电话" clearable />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select 
            v-model="searchForm.status" 
            placeholder="请选择状态" 
            clearable
            style="width: 120px"
          >
            <el-option label="未读" value="0" />
            <el-option label="已读" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="email" label="邮箱" width="180" />
      <el-table-column prop="phone" label="电话" width="150" />
      <el-table-column prop="content" label="留言内容" show-overflow-tooltip />
      <el-table-column label="提交时间">
        <template #default="scope">
          <time>{{ formatDate(scope.row.createAt) }}</time>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 0 ? 'warning' : 'success'">
            {{ scope.row.status === 0 ? '未处理' : '已处理' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button type="primary" @click="handleRead(scope.row)">已读</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getMessageList, markAsRead } from '../service/message'
import { formatDate } from '../utils';

// 搜索表单
const searchForm = reactive({
  name: '',
  email: '',
  phone: ''
})
const searchFormRef = ref(null)

// 表格数据
const tableData = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 获取留言列表数据
const fetchMessageList = async () => {
  loading.value = true
  try {
    const res = await getMessageList({
      ...searchForm,
      pageNum: currentPage.value,
      pageSize: pageSize.value
    })
    if (res) {
      tableData.value = res.items || []
      total.value = res.total || 0
    }
  } catch (error) {
    ElMessage.error('获取留言列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchMessageList()
}

// 重置搜索
const resetSearch = () => {
  searchFormRef.value.resetFields()
  currentPage.value = 1
  fetchMessageList()
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchMessageList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchMessageList()
}

// 已读操作
const handleRead = async (row) => {
  try {
    await markAsRead(row.id)
    ElMessage.success('已标记为已读')
    fetchMessageList()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

onMounted(() => {
  fetchMessageList()
})
</script>

<style scoped>
.message-list-container {
  padding: 20px;
}

.search-form {
  margin-bottom: 20px;
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>