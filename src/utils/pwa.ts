import { registerSW } from "workbox-window";

export function registerPWA() {
  if ("serviceWorker" in navigator) {
    const wb = new registerSW({
      onNeedRefresh() {
        // 显示更新提示
        console.log("有新版本可用");
      },
      onOfflineReady() {
        // 显示离线就绪提示
        console.log("应用已可离线使用");
      },
    });

    wb.register();
  }
}
