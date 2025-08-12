<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElForm, ElFormItem, ElInput, ElButton, ElUpload, ElMessage, type UploadProps } from 'element-plus';
import { useCompanyApi, type Company } from '../service/company';

const formData = ref<Company>({
  address: '',
  phone: '',
  email: '',
  wechatQrCode: '',
});

const fileList = ref([]);
const uploading = ref(false);
const { getCompany, updateCompany } = useCompanyApi();

const loadCompanyInfo = async () => {
  try {
    const { data } = await getCompany();
    if (data) {
      formData.value = data;
      if (data.wechatQrCode) {
        fileList.value = [{
          name: '微信二维码',
          url: `/api/uploads/${data.wechatQrCode}`,
        }];
      }
    }
  } catch (error) {
    console.error('Failed to load company info:', error);
    ElMessage.error('加载公司信息失败');
  }
};

const handleSubmit = async () => {
  if (uploading.value) return;
  
  uploading.value = true;
  const formDataToSend = new FormData();
  
  formDataToSend.append('address', formData.value.address || '');
  formDataToSend.append('phone', formData.value.phone || '');
  formDataToSend.append('email', formData.value.email || '');
  
  if (fileList.value.length > 0 && fileList.value[0].raw) {
    formDataToSend.append('wechatQrCodeFile', fileList.value[0].raw);
  }
  
  try {
    await updateCompany(formDataToSend);
    ElMessage.success('公司信息更新成功');
    await loadCompanyInfo();
  } catch (error) {
    console.error('Failed to update company info:', error);
    ElMessage.error('更新公司信息失败');
  } finally {
    uploading.value = false;
  }
};

const handleFileChange: UploadProps['onChange'] = (uploadFile) => {
  fileList.value = [uploadFile];
};

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error('只能上传图片文件!');
    return false;
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB!');
    return false;
  }
  return false; // 阻止自动上传
};

onMounted(() => {
  loadCompanyInfo();
});
</script>

<template>
  <div class="company-info">
    <div class="page-header">
      <h2>公司基本信息</h2>
      <p>管理公司的基本信息，包括地址、联系方式和微信二维码</p>
    </div>
    
    <div class="form-container">
      <ElForm :model="formData" label-width="120px" size="large">
        <ElFormItem label="公司地址">
          <ElInput
            v-model="formData.address"
            placeholder="请输入公司地址"
            type="textarea"
            :rows="3"
          />
        </ElFormItem>
        
        <ElFormItem label="联系电话">
          <ElInput
            v-model="formData.phone"
            placeholder="请输入联系电话"
          />
        </ElFormItem>
        
        <ElFormItem label="电子邮箱">
          <ElInput
            v-model="formData.email"
            placeholder="请输入电子邮箱"
          />
        </ElFormItem>
        
        <ElFormItem label="微信二维码">
          <ElUpload
            v-model:file-list="fileList"
            class="upload-demo"
            drag
            :auto-upload="false"
            :on-change="handleFileChange"
            :before-upload="beforeUpload"
            :limit="1"
            accept="image/*"
            list-type="picture"
          >
            <div class="upload-content">
              <el-icon class="upload-icon"><upload-filled /></el-icon>
              <div class="upload-text">点击或拖拽文件到此处上传</div>
              <div class="upload-tip">支持 jpg、png、gif 格式，文件大小不超过 2MB</div>
            </div>
          </ElUpload>
        </ElFormItem>
        
        <ElFormItem>
          <ElButton
            type="primary"
            :loading="uploading"
            @click="handleSubmit"
            size="large"
          >
            {{ uploading ? '保存中...' : '保存更新' }}
          </ElButton>
        </ElFormItem>
      </ElForm>
    </div>
  </div>
</template>

<style scoped>
.company-info {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.page-header p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.form-container {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.upload-content {
  text-align: center;
  padding: 20px;
}

.upload-icon {
  font-size: 48px;
  color: #c0c4cc;
  margin-bottom: 16px;
}

.upload-text {
  font-size: 16px;
  color: #606266;
  margin-bottom: 8px;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
}

:deep(.el-upload-dragger) {
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  width: 100%;
  height: auto;
  padding: 0;
}

:deep(.el-upload-dragger:hover) {
  border-color: #409eff;
}
</style>