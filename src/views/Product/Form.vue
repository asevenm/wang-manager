<template>
  <el-form
    ref="ruleFormRef"
    style="max-width: 600px"
    :model="ruleForm"
    :rules="rules"
    label-width="auto"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
  >
    <el-form-item label="名称" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>
    <el-form-item label="描述" prop="desc">
      <el-input v-model="ruleForm.desc" type="textarea" />
    </el-form-item>
    <el-form-item label="产地" prop="region">
      <el-input v-model="ruleForm.region" />
    </el-form-item>
    <el-form-item label="类型" prop="typeId">
      <el-tree-select
        v-model="ruleForm.typeId"
        :data="types"
        :render-after-expand="false"
        :props="defaultProps"
        defaultExpandAll	
      />
    </el-form-item>
    <el-form-item label="图片" prop="images">
      <el-upload
        :file-list="ruleForm.images"
        class="upload-demo"
        action="/api/files/upload"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-change="onImagesChange"
        :on-success="handleUploadSuccess"
        list-type="picture"
        accept="image/*"
      >
        <el-button type="primary">点击上传</el-button>
        <template #tip>
          <div class="el-upload__tip">
            jpg/png files with a size less than 500kb
          </div>
        </template>
      </el-upload>
    </el-form-item>
    <el-form-item label="功能" :props="features">
      <div class="feature-field">
        <div v-for="(item, index) in ruleForm.features" :key="index">
          <el-row class="feature-name">
            <el-col :span="16">
              <el-form-item
                label="名称"
                :prop="'features.' + index +'.text'"
                :rules="{required: true, message:'请输入特点', trigger: 'blur'}"
              >
                <el-input v-model="item.text"  placeholder="请输入" maxlength="30" />
              </el-form-item>
            </el-col>
            <el-col :span="4" style="text-align: right">
              <el-button class="mt-2" @click.prevent="removeFeature(item)" type="danger">
                删除
              </el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="图片" prop="'features.' + index + '.images'">
                <el-upload
                  :file-list="item.images"
                  class="upload-demo"
                  action="/api/files/upload"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :on-change="onImagesChange"
                  :on-success="handleFeatureUploadSuccess"
                  list-type="picture"
                  accept="image/*"
                >
                  <el-button type="primary">点击上传</el-button>
                  <template #tip>
                    <div class="el-upload__tip">
                      jpg/png files with a size less than 500kb
                    </div>
                  </template>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-button class="mt-2" @click.prevent="addFeature()" type="primary">
          新增功能
        </el-button>
      </div>
    </el-form-item>
    <el-form-item label="型号" props="models">
      <div class="model-field">
    <div v-for="(item, index) in ruleForm.models" :key="index">

      <el-row>
        <el-col :span="16">
          <el-form-item
            label="名称"
            :prop="'models.' + index +'.name'"
            :rules="{required: true, message:'请输入型号', trigger: 'blur'}"
          >
            <el-input v-model="item.name"  placeholder="请输入" maxlength="30" />
          </el-form-item>
        </el-col>
        <el-col :span="4" style="text-align: right">
          <el-button class="mt-2" @click.prevent="removeModel(item)" type="danger">
            删除
          </el-button>
        </el-col>
      </el-row>

      <div v-for="(i, pos) in item.params" :key="pos">
        <el-row>
          <el-col :span="10">
            <el-form-item 
              label="参数名称"
              :prop="'models.' + index + '.params.' + pos +'.name'"
              :rules="{required: true, message:'请输入参数名称', trigger: 'blur'}"
            >
              <el-input v-model="i.name"  placeholder="请输入" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item 
              label="参数值"
              :prop="'models.' + index + '.params.' + pos +'.value'"
              :rules="{required: true, message:'请输入参数值', trigger: 'blur'}"
            >
              <el-input v-model="i.value" placeholder="请输入" maxlength="10" />
            </el-form-item>
          </el-col>
          <el-col :span="4" style="text-align: right">
            <el-button class="mt-2" @click.prevent="removeParam(item.params, pos)" type="danger">
              删除
            </el-button>
          </el-col>
        </el-row>
      </div>
          <el-button class="mt-2" @click.prevent="addParam(item)" type="primary">
            新增参数
          </el-button>
      </div>
      <el-button class="mt-2" @click.prevent="addModel()" type="primary">
        新增型号
      </el-button>
    </div>
    </el-form-item>
    <el-form-item class="fixed-bottom">
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        确定
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, inject, Ref, watch } from 'vue'
import type { ComponentSize, FormInstance, FormRules, UploadProps } from 'element-plus'
import { addOrUpdateInrtrument } from '../../service/instrument';
import type { Tree } from './Types.vue';
import { RuleForm, Model, Param } from './type';


const props = defineProps<{ initValue: RuleForm & { id?: number }, types: Tree[], onSuccess: () => void }>();

const editRow = inject<Ref<RuleForm>>('editRow');
const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  name: '',
  region: '',
  typeId: '',
  desc: '',
  features: [],
  models: [],
  // images: [
  //   {
  //     name: 'food.jpeg',
  //     url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  //   },
  //   {
  //     name: 'food2.jpeg',
  //     url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  //   },
  // ]
  images: [],
});
watch(editRow, (newValue) => {
  Object.assign(ruleForm, newValue ?? {
    name: '',
    region: '',
    typeId: '',
    desc: '',
    features: [],
    models: [],
    images: [],
  });
}, { immediate: true });


const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ],
  desc: [
    { required: true, message: '请输入描述', trigger: 'blur' },
  ],
  // region: [
  //   { required: true, message: '请输入产地', trigger: 'blur' },
  // ],
  // images: [
  //   { required: true, message: '请上传图片', trigger: 'blur' },
  // ],
  features: [
    { required: true, message: '请添加特点', trigger: 'blur' },
  ],
  models: [
    { required: true, message: '请添加参数', trigger: 'blur' },
  ],
  typeId: [
    {
      required: true,
      message: '请选择类型',
      trigger: 'change',
    },
  ],
})

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePreview: UploadProps['onPreview'] = (file) => {
  console.log(file)
}

const removeFeature = (item) => {
  const index = ruleForm.features.indexOf(item)
  if (index !== -1) {
    ruleForm.features.splice(index, 1)
  }
}

const onFeatureImagesChange = (...rest) => {

}

const onImagesChange = (...rest) => {
  console.log(rest)
}

const addFeature = () => {
  ruleForm.features.push({text: ''});
}

const addModel = () => {
  ruleForm.models.push({ name: '', params: [] });
}

const removeModel = (item: Model) => {
  const index = ruleForm.models.indexOf(item)
  if (index !== -1) {
    ruleForm.models.splice(index, 1)
  }
}

const addParam = (item: Model) => {
  item.params.push({
    name: '',
    value: '',
  })
}

const removeParam = (list: Param[], i: number) => {
  list.splice(i, 1);
}

const handleUploadSuccess = (response, file, fileList) => {
  if (response && response.data) {
    const img = {
      name: response.data.originalname,
      url: response.data.url
    };
    ruleForm.images.push(img);
  }
}

const handleFeatureUploadSuccess = (response, file, fileList) => {
  if (response && response.data) {
    const img = {
      name: response.data.originalname,
      url: response.data.url
    };
    ruleForm.features.forEach(item => {
      if (item.images) {
        item.images.push(img);
      }
    });
  }
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      addOrUpdateInrtrument({ ...ruleForm, id: props.initValue?.id }).then((res) => {
        if (res) {
          props.onSuccess && props.onSuccess();
          resetForm(formEl);
        }
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const defaultProps = {
  children: 'children',
  label: 'name',
  value: 'id',
}

</script>

<style>
  .feature-item .el-form-item__content {
    flex-direction: column;
  }
  .fixed-bottom {
    position: fixed;
    bottom: 0;
    background: #fff;
    width: 740px;
    right: 0;
    margin-bottom: 0;
    padding: 16px;
    box-sizing: border-box;
  }
  .el-drawer__body {
    padding-bottom: 100px;
  }
  .feature-field {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .feature-name {
    margin-bottom: 18px;
  }
  .model-field {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
</style>
