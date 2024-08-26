import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import axios from 'axios'


import App from './App.vue'
import router from './router'
import '@/styles/index.less'

axios.defaults.baseURL = '/api';

const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn,
})


app.use(createPinia())
app.use(router)

app.mount('#app')
