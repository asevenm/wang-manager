<template>
  <div class="article-management">
    <div class="page-header">
      <h1>技术文章管理</h1>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增文章
      </el-button>
    </div>

    <!-- 搜索和筛选 -->
    <el-card class="filter-card">
      <el-form inline :model="queryForm" @submit.prevent="handleSearch">
        <el-form-item label="文章类型">
          <el-select v-model="queryForm.type" placeholder="所有类型" clearable>
            <el-option label="公众号文章" value="wechat" />
            <el-option label="视频分享" value="video" />
            <el-option label="行业资讯" value="news" />
          </el-select>
        </el-form-item>

        <el-form-item label="发布状态">
          <el-select v-model="queryForm.published" placeholder="所有状态" clearable>
            <el-option label="已发布" :value="true" />
            <el-option label="未发布" :value="false" />
          </el-select>
        </el-form-item>

        <el-form-item label="关键词">
          <el-input
            v-model="queryForm.keyword"
            placeholder="搜索标题、摘要或内容"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 文章列表 -->
    <el-card>
      <el-table
        v-loading="loading"
        :data="articles"
        style="width: 100%"
        row-key="id"
      >
        <el-table-column prop="title" label="标题" min-width="200">
          <template #default="{ row }">
            <div class="article-title">
              <el-text :title="row.title">{{ row.title }}</el-text>
              <el-tag v-if="row.type === 'wechat'" type="success" size="small">公众号</el-tag>
              <el-tag v-else-if="row.type === 'video'" type="warning" size="small">视频</el-tag>
              <el-tag v-else type="info" size="small">资讯</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="summary" label="摘要" min-width="250" show-overflow-tooltip />

        <el-table-column label="作者/分类" width="120">
          <template #default="{ row }">
            <div v-if="row.author">{{ row.author }}</div>
            <div v-if="row.category">{{ row.category }}</div>
          </template>
        </el-table-column>

        <el-table-column label="发布状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.published"
              @change="handleTogglePublish(row)"
              :loading="row.toggleLoading"
            />
          </template>
        </el-table-column>

        <el-table-column label="发布时间" width="180">
          <template #default="{ row }">
            {{ row.publishDate ? formatDate(row.publishDate) : '-' }}
          </template>
        </el-table-column>

        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">查看</el-button>
            <el-button size="small" type="warning" @click="handleEdit(row)">编辑</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(row)"
              :loading="row.deleteLoading"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          :current-page="queryForm.page"
          :page-size="queryForm.limit"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 文章详情弹窗 -->
    <el-dialog
      v-model="viewDialogVisible"
      :title="viewArticle?.title"
      width="80%"
      class="article-view-dialog"
    >
      <div v-if="viewArticle" class="article-content">
        <div class="article-meta">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="文章类型">
              <el-tag v-if="viewArticle.type === 'wechat'" type="success">公众号文章</el-tag>
              <el-tag v-else-if="viewArticle.type === 'video'" type="warning">视频分享</el-tag>
              <el-tag v-else type="info">行业资讯</el-tag>
            </el-descriptions-item>
            <el-descriptions-item v-if="viewArticle.author" label="作者">
              {{ viewArticle.author }}
            </el-descriptions-item>
            <el-descriptions-item v-if="viewArticle.category" label="分类">
              {{ viewArticle.category }}
            </el-descriptions-item>
            <el-descriptions-item v-if="viewArticle.duration" label="时长">
              {{ viewArticle.duration }}
            </el-descriptions-item>
            <el-descriptions-item v-if="viewArticle.views" label="播放量">
              {{ viewArticle.views }}
            </el-descriptions-item>
            <el-descriptions-item label="发布状态">
              <el-tag :type="viewArticle.published ? 'success' : 'info'">
                {{ viewArticle.published ? '已发布' : '未发布' }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="article-summary">
          <h3>摘要</h3>
          <p>{{ viewArticle.summary }}</p>
        </div>

        <div class="article-body">
          <h3>正文</h3>
          <div v-html="viewArticle.content" class="content-html"></div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { articleApi, type Article, type ArticleQuery } from '../service/article'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const articles = ref<Article[]>([])
const total = ref(0)
const viewDialogVisible = ref(false)
const viewArticle = ref<Article | null>(null)

// 查询表单
const queryForm = reactive<ArticleQuery & { page: number; limit: number }>({
  page: 1,
  limit: 20,
  type: undefined,
  published: undefined,
  keyword: '',
  sortBy: 'createdAt',
  sortOrder: 'DESC'
})

// 加载文章列表
const loadArticles = async () => {
  try {
    loading.value = true
    const response = await articleApi.getAll(queryForm)
    articles.value = response.data.items.map(item => ({
      ...item,
      toggleLoading: false,
      deleteLoading: false
    }))
    total.value = response.data.meta.totalItems
  } catch (error) {
    console.error('加载文章列表失败:', error)
    ElMessage.error('加载文章列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  queryForm.page = 1
  loadArticles()
}

// 重置搜索
const handleReset = () => {
  Object.assign(queryForm, {
    page: 1,
    limit: 20,
    type: undefined,
    published: undefined,
    keyword: '',
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  })
  loadArticles()
}

// 分页相关
const handleSizeChange = (val: number) => {
  queryForm.limit = val
  queryForm.page = 1
  loadArticles()
}

const handleCurrentChange = (val: number) => {
  queryForm.page = val
  loadArticles()
}

// 新增文章
const handleAdd = () => {
  router.push('/articles/add')
}

// 查看文章
const handleView = (article: Article) => {
  viewArticle.value = article
  viewDialogVisible.value = true
}

// 编辑文章
const handleEdit = (article: Article) => {
  router.push(`/articles/edit/${article.id}`)
}

// 切换发布状态
const handleTogglePublish = async (article: any) => {
  try {
    article.toggleLoading = true
    await articleApi.togglePublish(article.id!)
    ElMessage.success(article.published ? '文章已发布' : '文章已取消发布')
    // 重新加载当前页数据
    loadArticles()
  } catch (error) {
    console.error('切换发布状态失败:', error)
    ElMessage.error('操作失败')
    // 恢复原状态
    article.published = !article.published
  } finally {
    article.toggleLoading = false
  }
}

// 删除文章
const handleDelete = async (article: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除文章"${article.title}"吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    article.deleteLoading = true
    await articleApi.delete(article.id!)
    ElMessage.success('文章删除成功')
    loadArticles()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除文章失败:', error)
      ElMessage.error('删除失败')
    }
  } finally {
    article.deleteLoading = false
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 初始化
onMounted(() => {
  loadArticles()
})
</script>

<style scoped>
.article-management {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.filter-card {
  margin-bottom: 20px;
}

.article-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.article-view-dialog .article-content {
  max-height: 600px;
  overflow-y: auto;
}

.article-meta {
  margin-bottom: 20px;
}

.article-summary {
  margin-bottom: 20px;
}

.article-summary h3,
.article-body h3 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 16px;
}

.article-summary p {
  margin: 0;
  color: #606266;
  line-height: 1.6;
}

.article-body {
  margin-bottom: 20px;
}

.content-html {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 16px;
  background-color: #fafafa;
  max-height: 400px;
  overflow-y: auto;
}

.content-html :deep(h1),
.content-html :deep(h2),
.content-html :deep(h3),
.content-html :deep(h4),
.content-html :deep(h5),
.content-html :deep(h6) {
  margin: 16px 0 8px 0;
  color: #303133;
}

.content-html :deep(p) {
  margin: 8px 0;
  line-height: 1.6;
  color: #606266;
}

.content-html :deep(ul),
.content-html :deep(ol) {
  margin: 8px 0;
  padding-left: 20px;
}

.content-html :deep(blockquote) {
  margin: 16px 0;
  padding: 12px 16px;
  background-color: #f9f9f9;
  border-left: 4px solid #409eff;
  color: #606266;
}

.content-html :deep(pre) {
  background-color: #f5f5f5;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  padding: 12px;
  margin: 8px 0;
  overflow-x: auto;
}

.content-html :deep(code) {
  background-color: #f5f5f5;
  padding: 2px 4px;
  border-radius: 2px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style>