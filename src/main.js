import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import VueAwesomePaginate from "vue-awesome-paginate";
import "vue-awesome-paginate/dist/style.css";
const app = createApp(App)

app.use(createPinia())
// 实现动态加载页面标题
router.beforeEach((to,from,next)=>{
    document.title = to.meta.title||"MightyFace"
    next()
})
app.use(router)
app.use(VueAwesomePaginate)
app.mount('#app')
