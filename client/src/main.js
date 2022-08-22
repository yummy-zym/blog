import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
import {createDiscreteApi} from 'naive-ui'
import { createPinia } from 'pinia'
import {router} from "./common/router";
import axios from "axios"
import {AdminStore} from "./stores/AdminStore";
/**
 * axios
 * pinia  状态管理模块
 * sass  简化css
 * vue-router  路由
 * naive-ui  ui
 * wangEditor 富文本编辑
 */

//配置服务端地址前缀
axios.defaults.baseURL="http://localhost:8080"

const app=createApp(App)

const { message, notification, dialog } = createDiscreteApi(['message', 'dialog', 'notification'])
app.provide("axios",axios)
app.provide("notification",notification)
app.provide("message",message)
app.provide("dialog",dialog)
app.provide("server_url","http://localhost:8080")

app.use(naive)
app.use(createPinia())
app.use(router)

const adminStore=AdminStore()
//拦截器 添加token
axios.interceptors.request.use((config)=>{
    config.headers.token=adminStore.token
    return config
})

app.mount('#app')
