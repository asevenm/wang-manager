<template>
  <div class="article-edit">
    <div class="page-header">
      <h1>{{ isEdit ? '编辑文章' : '新增文章' }}</h1>
      <div class="header-actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button @click="handleSave(false)" :loading="saveLoading">保存草稿</el-button>
        <el-button type="primary" @click="handleSave(true)" :loading="saveLoading">
          {{ isEdit ? '更新并发布' : '保存并发布' }}
        </el-button>
      </div>
    </div>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="article-form"
    >
      <el-row :gutter="20">
        <el-col :span="16">
          <!-- 基本信息 -->
          <el-card class="form-card">
            <template #header>
              <span>基本信息</span>
            </template>

            <el-form-item label="文章标题" prop="title">
              <el-input
                v-model="form.title"
                placeholder="请输入文章标题"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="文章摘要" prop="summary">
              <el-input
                v-model="form.summary"
                type="textarea"
                :rows="3"
                placeholder="请输入文章摘要"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="文章内容" prop="content">
              <RichTextEditor
                v-model="form.content"
                height="500px"
                placeholder="请输入文章内容..."
              />
            </el-form-item>
          </el-card>
        </el-col>

        <el-col :span="8">
          <!-- 文章设置 -->
          <el-card class="form-card">
            <template #header>
              <span>文章设置</span>
            </template>

            <el-form-item label="文章类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择文章类型" style="width: 100%">
                <el-option label="公众号文章" value="wechat" />
                <el-option label="视频分享" value="video" />
                <el-option label="行业资讯" value="news" />
              </el-select>
            </el-form-item>

            <!-- 公众号文章特有字段 -->
            <template v-if="form.type === 'wechat'">
              <el-form-item label="作者" prop="author">
                <el-input v-model="form.author" placeholder="请输入作者" />
              </el-form-item>
            </template>

            <!-- 视频分享特有字段 -->
            <template v-if="form.type === 'video'">
              <el-form-item label="视频时长" prop="duration">
                <el-input v-model="form.duration" placeholder="如：15:30" />
              </el-form-item>
              <el-form-item label="播放量" prop="views">
                <el-input v-model="form.views" placeholder="如：1.2k" />
              </el-form-item>
              <el-form-item label="视频链接" prop="videoUrl">
                <el-input v-model="form.videoUrl" placeholder="请输入视频链接" />
              </el-form-item>
            </template>

            <!-- 行业资讯特有字段 -->
            <template v-if="form.type === 'news'">
              <el-form-item label="分类" prop="category">
                <el-input v-model="form.category" placeholder="请输入分类" />
              </el-form-item>
            </template>

            <el-form-item label="封面图片">
              <div class="cover-upload">
                <el-upload
                  class="cover-uploader"
                  action="#"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  :http-request="handleUpload"
                  accept="image/*"
                >
                  <img v-if="form.coverImage" :src="form.coverImage" class="cover-image" />
                  <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
                </el-upload>
                <div class="upload-tips">
                  <p>支持 JPG、PNG、GIF 格式</p>
                  <p>文件大小不超过 5MB</p>
                  <el-button v-if="form.coverImage" size="small" type="danger" @click="removeCover">
                    删除封面
                  </el-button>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="发布时间">
              <el-date-picker
                v-model="publishDateTime"
                type="datetime"
                placeholder="选择发布时间"
                style="width: 100%"
                :disabled-date="disabledDate"
              />
            </el-form-item>

            <el-form-item label="发布状态">
              <el-switch
                v-model="form.published"
                active-text="已发布"
                inactive-text="草稿"
              />
            </el-form-item>
          </el-card>

          <!-- 预览 -->
          <el-card class="form-card">
            <template #header>
              <span>预览</span>
            </template>
            <div class="preview-content">
              <h3 v-if="form.title">{{ form.title }}</h3>
              <p v-if="form.summary" class="preview-summary">{{ form.summary }}</p>
              <div class="preview-meta">
                <el-tag v-if="form.type === 'wechat'" type="success" size="small">公众号文章</el-tag>
                <el-tag v-else-if="form.type === 'video'" type="warning" size="small">视频分享</el-tag>
                <el-tag v-else-if="form.type === 'news'" type="info" size="small">行业资讯</el-tag>
                <span v-if="form.author" class="meta-item">作者：{{ form.author }}</span>
                <span v-if="form.category" class="meta-item">分类：{{ form.category }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'
import RichTextEditor from '../components/RichTextEditor.vue'
import { articleApi, type Article } from '../service/article'

const route = useRoute()
const router = useRouter()

// 判断是否为编辑模式
const isEdit = computed(() => !!route.params.id)

// 响应式数据
const formRef = ref<FormInstance>()
const saveLoading = ref(false)
const publishDateTime = ref<Date>()

// 表单数据
const form = reactive<Partial<Article>>({
  title: '',
  summary: '',
  content: '',
  type: 'wechat',
  author: '',
  category: '',
  duration: '',
  views: '',
  videoUrl: '',
  coverImage: '',
  published: false
})

// 表单验证规则
const rules: FormRules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 1, max: 200, message: '标题长度为 1 到 200 个字符', trigger: 'blur' }
  ],
  summary: [
    { required: true, message: '请输入文章摘要', trigger: 'blur' },
    { min: 1, max: 500, message: '摘要长度为 1 到 500 个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择文章类型', trigger: 'change' }
  ]
}

// 加载文章数据（编辑模式）
const loadArticle = async () => {
  if (!isEdit.value) return

  try {
    const id = route.params.id as string
    const response = await articleApi.getOne(id)
    const article = response.data

    Object.assign(form, article)
    if (article.publishDate) {
      publishDateTime.value = new Date(article.publishDate)
    }
  } catch (error) {
    console.error('加载文章失败:', error)
    ElMessage.error('加载文章失败')
    router.push('/articles')
  }
}

// 保存文章
const handleSave = async (publish: boolean = false) => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    saveLoading.value = true

    const articleData = {
      ...form,
      published: publish || form.published,
      publishDate: publishDateTime.value ? publishDateTime.value.toISOString() : undefined
    }

    if (isEdit.value) {
      await articleApi.update(route.params.id as string, articleData)
      ElMessage.success('文章更新成功')
    } else {
      await articleApi.create(articleData as any)
      ElMessage.success('文章创建成功')
    }

    router.push('/articles')
  } catch (error: any) {
    if (error?.message) {
      ElMessage.error(error.message)
    } else {
      console.error('保存文章失败:', error)
      ElMessage.error('保存失败')
    }
  } finally {
    saveLoading.value = false
  }
}

// 取消编辑
const handleCancel = async () => {
  // 检查是否有未保存的更改
  if (form.title || form.content || form.summary) {
    try {
      await ElMessageBox.confirm(
        '您有未保存的更改，确定要离开吗？',
        '离开确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
    } catch {
      return
    }
  }

  router.push('/articles')
}

// 文件上传相关
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isValidType) {
    ElMessage.error('上传图片只能是 JPG、PNG、GIF、WebP 格式!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('上传图片大小不能超过 5MB!')
    return false
  }
  return true
}

const handleUpload = async ({ file }: { file: File }) => {
  try {
    const response = await articleApi.uploadCover(file)
    form.coverImage = response.data.url
    ElMessage.success('封面上传成功')
  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error('上传失败')
  }
}

const removeCover = () => {
  form.coverImage = ''
}

// 禁用过去的日期
const disabledDate = (time: Date) => {
  return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
}

// 初始化
onMounted(() => {
  loadArticle()
})
</script>

<style scoped>
.article-edit {
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

.header-actions {
  display: flex;
  gap: 12px;
}

.article-form {
  width: 100%;
}

.form-card {
  margin-bottom: 20px;
}

.cover-upload {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.cover-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

.cover-uploader:hover {
  border-color: #409eff;
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.cover-image {
  width: 120px;
  height: 120px;
  display: block;
  object-fit: cover;
}

.upload-tips {
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}

.upload-tips p {
  margin: 0 0 4px 0;
}

.preview-content h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #303133;
}

.preview-summary {
  margin: 0 0 12px 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
}

.preview-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
}

.meta-item {
  color: #909399;
}
</style>