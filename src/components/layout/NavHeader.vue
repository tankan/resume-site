<template>
  <header class="nav-header">
    <div class="logo">
      <router-link to="/">{{ t("header.title") }}</router-link>
    </div>
    <nav class="nav-menu">
      <el-space>
        <el-button text @click="openThemeConfig">
          <el-icon size="16">
            <i-ep-brush />
          </el-icon>
          <span class="button-text">{{ t("theme.title") }}</span>
        </el-button>
        <el-dropdown trigger="click" @command="handleLanguageChange">
          <el-button text>
            <el-icon size="16"><HugeiconsTranslation /></el-icon>
            <span class="button-text">{{
              t(`header.language.${currentLocale === "zh-CN" ? "zh" : "en"}`)
            }}</span>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="zh-CN">简体中文</el-dropdown-item>
              <el-dropdown-item command="en-US">English</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-space>
    </nav>
    <theme-config ref="themeConfigRef" />
  </header>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useStorage } from "@vueuse/core";
import HugeiconsTranslation from "~icons/hugeicons/translation";
import ThemeConfig from "@/components/common/ThemeConfig.vue";

const { t, locale } = useI18n();
const currentLocale = useStorage("vueuse-locale", "zh-CN");
const themeConfigRef = ref();

const openThemeConfig = () => {
  themeConfigRef.value?.open();
};

const handleLanguageChange = (lang: string) => {
  locale.value = lang;
  currentLocale.value = lang;
};

// 初始化语言
watchEffect(() => {
  locale.value = currentLocale.value;
});
</script>

<style scoped lang="scss">
.nav-header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: var(--theme-background);
  transition:
    background-color 0.3s,
    border-color 0.3s;

  .logo {
    a {
      color: var(--theme-textPrimary);
      text-decoration: none;
      font-size: 18px;
      font-weight: bold;
      transition: color 0.3s;
    }
  }

  .nav-menu {
    display: flex;
    align-items: center;
    gap: 8px;

    .button-text {
      margin-left: 4px;
      font-size: 14px;
    }

    .el-button {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
  }
}
</style>
