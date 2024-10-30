import { registerSW } from "virtual:pwa-register";

export const registerPWA = () => {
  registerSW({
    onNeedRefresh() {
      // 可以在这里添加更新提示逻辑
      console.log("有新内容可用，请刷新页面");
    },
    onOfflineReady() {
      console.log("应用已经可以离线使用");
    },
  });
};
