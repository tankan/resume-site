import { createApp } from "vue";
import { createPinia } from "pinia";
import { createHead } from "@unhead/vue";
import { i18n } from "./locales";
import App from "./App.vue";
import router from "./router";
import { registerPWA } from "./pwa";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "@/assets/styles/dark.scss";
import "@/assets/styles/main.scss";

const app = createApp(App);
const head = createHead();

app.use(createPinia()).use(router).use(i18n).use(head).mount("#app");

// 注册 PWA
registerPWA();
