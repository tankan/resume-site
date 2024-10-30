import { defineStore } from "pinia";
import { ref, watch } from "vue";
import type { ThemeColors } from "@/config/theme";
import { defaultTheme, darkTheme } from "@/config/theme";

export const useThemeStore = defineStore("theme", () => {
  const isDark = ref(false);
  const currentTheme = ref<ThemeColors>(defaultTheme);

  const updateTheme = (theme: Partial<ThemeColors>) => {
    Object.assign(currentTheme.value, theme);
    applyTheme();
  };

  const toggleDarkMode = (value: boolean) => {
    isDark.value = value;
    currentTheme.value = value ? darkTheme : defaultTheme;
    applyTheme();
  };

  const applyTheme = () => {
    const html = document.documentElement;
    if (isDark.value) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    Object.entries(currentTheme.value).forEach(([key, value]) => {
      html.style.setProperty(`--theme-${key}`, value);
    });
  };

  // 监听主题变化
  watch(() => currentTheme.value, applyTheme, { deep: true });

  return {
    isDark,
    currentTheme,
    updateTheme,
    toggleDarkMode,
  };
});
