import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'

// 顺序不能变：tokens → base → utilities
import './styles/tokens.css'
import './styles/base.css'
import './styles/utilities.css'

const app = createApp(App)

// pinia 必须先装：路由守卫里要用 session store
app.use(createPinia())
app.use(router)
app.mount('#app')
