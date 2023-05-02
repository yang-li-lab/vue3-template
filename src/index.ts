import {createApp} from "vue";
import App from "@/App.vue"
import setupRouter from "@/router";

console.log(process)

const app = createApp(App)

async function bootstrap() {
    setupRouter(app)
}

bootstrap()
app.mount('#app1')