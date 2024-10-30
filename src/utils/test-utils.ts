import { render } from "@testing-library/vue";
import { createI18n } from "vue-i18n";
import { createPinia } from "pinia";
import { createHead } from "@unhead/vue";
import ElementPlus from "element-plus";
import zhCN from "@/locales/zh-CN";
import enUS from "@/locales/en-US";

export function createTestI18n() {
  return createI18n({
    legacy: false,
    locale: "zh-CN",
    fallbackLocale: "zh-CN",
    messages: {
      "zh-CN": zhCN,
      "en-US": enUS,
    },
  });
}

export function renderWithPlugins(component: any, options = {}) {
  const i18n = createTestI18n();
  const pinia = createPinia();
  const head = createHead();

  return render(component, {
    global: {
      plugins: [i18n, pinia, ElementPlus, head],
      ...options?.global,
    },
    ...options,
  });
}
