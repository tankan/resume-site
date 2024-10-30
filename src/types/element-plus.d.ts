export {};

declare module "vue" {
  export interface GlobalComponents {
    ElButton: (typeof import("element-plus"))["ElButton"];
    ElMenu: (typeof import("element-plus"))["ElMenu"];
    ElMenuItem: (typeof import("element-plus"))["ElMenuItem"];
    ElDropdown: (typeof import("element-plus"))["ElDropdown"];
    ElDropdownMenu: (typeof import("element-plus"))["ElDropdownMenu"];
    ElDropdownItem: (typeof import("element-plus"))["ElDropdownItem"];
    ElSwitch: (typeof import("element-plus"))["ElSwitch"];
    ElColorPicker: (typeof import("element-plus"))["ElColorPicker"];
    ElDrawer: (typeof import("element-plus"))["ElDrawer"];
    ElConfigProvider: (typeof import("element-plus"))["ElConfigProvider"];
    ElResult: (typeof import("element-plus"))["ElResult"];
    ElIcon: (typeof import("element-plus"))["ElIcon"];
  }
}

declare module 'element-plus/dist/locale/zh-cn.mjs' {
  const zhCn: {
    name: string;
    el: {
      [key: string]: any;
    };
  };
  export default zhCn;
}
