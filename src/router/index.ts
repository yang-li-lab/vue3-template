import {createRouter, createWebHistory} from "vue-router";
import {App} from "vue";

const routes = [
    {
        path: '/',
        component: () => import('@/pages/HelloWorld.vue')
    }]
const router = createRouter({
    history: createWebHistory(),  // use history router
    routes: routes
})


// setup router
export default function setupRouter(app: App) {
    app.use(router)
}


