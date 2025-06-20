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
      <el-table-column prop="createTime" label="提交时间" width="180" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 0 ? 'warning' : 'success'">
            {{ scope.row.status === 0 ? '未处理' : '已处理' }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
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
const getMessageList = async () => {
  loading.value = true
  try {
    // 这里替换为实际的API调用
    // const res = await api.getMessageList({
    //   ...searchForm,
    //   pageNum: currentPage.value,
    //   pageSize: pageSize.value
    // })
    
    // 模拟数据
    setTimeout(() => {
      tableData.value = [
        {
          id: 1,
          name: '张三',
          email: 'zhangsan@example.com',
          phone: '13800138000',
          content: '我对贵公司的产品很感兴趣，请联系我详细了解。',
          createTime: '2023-05-15 14:30:22',
          status: 0
        },
        {
          id: 2,
          name: '李四',
          email: 'lisi@example.com',
          phone: '13900139000',
          content: '请问你们的产品有什么优惠活动吗？',
          createTime: '2023-05-16 09:45:10',
          status: 1
        }
      ]
      total.value = 2
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取留言列表失败', error)
    ElMessage.error('获取留言列表失败')
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  getMessageList()
}

// 重置搜索
const resetSearch = () => {
  searchFormRef.value.resetFields()
  currentPage.value = 1
  getMessageList()
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  getMessageList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  getMessageList()
}

onMounted(() => {
  getMessageList()
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