<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-width="100px"
    class="agent-brand-form"
  >
    <el-form-item label="品牌名称" prop="name">
      <el-input v-model="formData.name" placeholder="请输入品牌名称" />
    </el-form-item>

    <el-form-item label="品牌图标" prop="icon">
      <el-upload
        :before-upload="beforeUpload"
        accept="image/*"
        action="/api/files/upload"
        :on-success="handleUploadSuccess"
        list-type="picture"
        :file-list="fileList"
        :limit="1"
        :on-remove="handleRemove"
      >
        <el-button type="primary">上传图片</el-button>
        <template #tip>
          <div class="el-upload__tip">
            只能上传jpg/png文件，且不超过2MB
          </div>
        </template>
      </el-upload>
    </el-form-item>

    <el-form-item class="fixed-bottom">
      <el-button type="primary" @click="submitForm">
        {{ isEdit ? '保存' : '新增' }}
      </el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, watch, computed } from 'vue'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import { addOrUpdateAgentBrand } from '../../service/agent-brand'

interface Brand {
  id?: number
  name: string
  icon: string
}

const props = defineProps<{
  initValue?: Brand
  onSuccess: () => void
}>()

const formRef = ref<FormInstance>()
const fileList = ref<any[]>([])

const formData = reactive<Brand>({
  name: '',
  icon: ''
})

const isEdit = computed(() => !!props.initValue?.id)

// 监听初始值变化
watch(() => props.initValue, (newValue) => {
  if (newValue) {
    Object.assign(formData, newValue)
    // 设置文件列表用于显示已上传的图片
    if (newValue.icon) {
      fileList.value = [{
        name: 'icon',
        url: newValue.icon
      }]
    }
  }
}, { immediate: true, deep: true })

const rules = reactive<FormRules<Brand>>({
  name: [
    { required: true, message: '请输入品牌名称', trigger: 'blur' }
  ],
  icon: [
    { required: true, message: '请上传品牌图标', trigger: 'change' }
  ]
})

function beforeUpload(file: File) {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传文件大小不能超过 2MB!')
    return false
  }
  return true
}

function handleUploadSuccess(response: any, file: any, fileList: any[]) {
  if (response && response.data) {
    formData.icon = response.data.url
    ElMessage.success('图片上传成功')
  }
}

function handleRemove() {
  formData.icon = ''
  fileList.value = []
}

async function submitForm() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const payload = { ...formData }
        if (isEdit.value && props.initValue?.id) {
          payload.id = props.initValue.id
        }

        await addOrUpdateAgentBrand(payload)
        ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
        props.onSuccess?.()
      } catch (error) {
        ElMessage.error('操作失败，请重试')
        console.error('Submit error:', error)
      }
    }
  })
}

function resetForm() {
  if (!formRef.value) return
  formRef.value.resetFields()
  formData.name = ''
  formData.icon = ''
  fileList.value = []
}
</script>

<style scoped>
.agent-brand-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.fixed-bottom {
  position: fixed;
  bottom: 0;
  background: #fff;
  width: 100%;
  right: 0;
  margin-bottom: 0;
  padding: 16px;
  box-sizing: border-box;
  border-top: 1px solid #e4e7ed;
}

.fixed-bottom .el-form-item__content {
  display: flex;
  justify-content: center;
}
</style>