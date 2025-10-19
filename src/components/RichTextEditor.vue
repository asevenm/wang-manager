<template>
  <div class="rich-text-editor">
    <div class="editor-toolbar" v-if="showToolbar">
      <el-button-group size="small">
        <el-button @click="insertHeading(1)" title="标题1">H1</el-button>
        <el-button @click="insertHeading(2)" title="标题2">H2</el-button>
        <el-button @click="insertHeading(3)" title="标题3">H3</el-button>
      </el-button-group>

      <el-button-group size="small" class="ml-2">
        <el-button @click="insertList('ordered')" title="有序列表">
          <el-icon><MoreFilled /></el-icon>
        </el-button>
        <el-button @click="insertList('bullet')" title="无序列表">
          <el-icon><List /></el-icon>
        </el-button>
      </el-button-group>

      <el-button-group size="small" class="ml-2">
        <el-button @click="insertCodeBlock" title="代码块">
          <el-icon><Document /></el-icon>
        </el-button>
        <el-button @click="insertBlockquote" title="引用">
          <el-icon><ChatRound /></el-icon>
        </el-button>
      </el-button-group>
    </div>

    <QuillEditor
      ref="quillEditor"
      v-model:content="content"
      content-type="html"
      :options="editorOptions"
      :style="{ height: height }"
      @update:content="handleContentChange"
      @ready="onEditorReady"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import { ElButton, ElButtonGroup, ElIcon } from 'element-plus'
import { MoreFilled, List, Document, ChatRound } from '@element-plus/icons-vue'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

interface Props {
  modelValue?: string
  height?: string
  placeholder?: string
  showToolbar?: boolean
  readonly?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  height: '300px',
  placeholder: '请输入内容...',
  showToolbar: true,
  readonly: false
})

const emit = defineEmits<Emits>()

const quillEditor = ref()
const content = ref(props.modelValue)

// Quill编辑器配置
const editorOptions = computed(() => ({
  theme: 'snow',
  placeholder: props.placeholder,
  readOnly: props.readonly,
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video']
    ],
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: true
    }
  }
}))

// 监听props变化
watch(() => props.modelValue, (newValue) => {
  if (newValue !== content.value) {
    content.value = newValue
  }
})

// 监听内容变化
watch(content, (newValue) => {
  emit('update:modelValue', newValue)
  emit('change', newValue)
})

// 内容变化处理
const handleContentChange = (value: string) => {
  content.value = value
}

// 编辑器准备就绪
const onEditorReady = (quill: any) => {
  console.log('Quill editor ready:', quill)
}

// 插入标题
const insertHeading = (level: number) => {
  if (quillEditor.value) {
    const quill = quillEditor.value.getQuill()
    const range = quill.getSelection()
    if (range) {
      quill.formatLine(range.index, range.length, 'header', level)
    }
  }
}

// 插入列表
const insertList = (type: 'ordered' | 'bullet') => {
  if (quillEditor.value) {
    const quill = quillEditor.value.getQuill()
    const range = quill.getSelection()
    if (range) {
      quill.formatLine(range.index, range.length, 'list', type)
    }
  }
}

// 插入代码块
const insertCodeBlock = () => {
  if (quillEditor.value) {
    const quill = quillEditor.value.getQuill()
    const range = quill.getSelection()
    if (range) {
      quill.formatLine(range.index, range.length, 'code-block', true)
    }
  }
}

// 插入引用
const insertBlockquote = () => {
  if (quillEditor.value) {
    const quill = quillEditor.value.getQuill()
    const range = quill.getSelection()
    if (range) {
      quill.formatLine(range.index, range.length, 'blockquote', true)
    }
  }
}

// 获取编辑器实例（供父组件调用）
const getQuillInstance = () => {
  return quillEditor.value?.getQuill()
}

// 获取纯文本内容
const getTextContent = () => {
  const quill = getQuillInstance()
  return quill ? quill.getText() : ''
}

// 设置内容
const setContent = (html: string) => {
  content.value = html
}

// 清空内容
const clearContent = () => {
  content.value = ''
}

// 获取内容长度
const getContentLength = () => {
  const quill = getQuillInstance()
  return quill ? quill.getLength() : 0
}

// 暴露方法给父组件
defineExpose({
  getQuillInstance,
  getTextContent,
  setContent,
  clearContent,
  getContentLength
})
</script>

<style scoped>
.rich-text-editor {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.editor-toolbar {
  padding: 8px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
}

.ml-2 {
  margin-left: 8px;
}

:deep(.ql-editor) {
  min-height: 200px;
  font-size: 14px;
  line-height: 1.6;
}

:deep(.ql-editor.ql-blank::before) {
  font-style: normal;
  color: #c0c4cc;
}

:deep(.ql-toolbar) {
  border: none;
  border-bottom: 1px solid #dcdfe6;
}

:deep(.ql-container) {
  border: none;
}

/* 代码块样式 */
:deep(.ql-editor pre.ql-syntax) {
  background-color: #f5f5f5;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  padding: 12px;
  margin: 8px 0;
  overflow-x: auto;
}

/* 引用样式 */
:deep(.ql-editor blockquote) {
  border-left: 4px solid #409eff;
  padding-left: 16px;
  margin: 8px 0;
  color: #606266;
  background-color: #f9f9f9;
  padding: 12px 16px;
  border-radius: 4px;
}
</style>