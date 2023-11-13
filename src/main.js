import { createApp } from 'vue'
import ElementPlus from 'element-plus' //需要加入的代码
import 'element-plus/theme-chalk/index.css'
import 'element-plus/theme-chalk/display.css'
import App from './App.vue'

let app = createApp(App)
app.use(ElementPlus) //需要加入的代码
app.mount('#app')
