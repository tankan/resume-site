<template>
  <el-drawer
    v-model="visible"
    :title="t('theme.title')"
    direction="rtl"
    size="300px"
  >
    <div class="theme-config">
      <div class="theme-section">
        <h3>{{ t("theme.mode") }}</h3>
        <el-switch
          v-model="isDark"
          inline-prompt
          :active-icon="Moon"
          :inactive-icon="Sunny"
          @change="toggleTheme"
        />
      </div>

      <template v-if="!isDark">
        <div class="theme-section">
          <h3>{{ t("theme.primaryColor") }}</h3>
          <el-color-picker
            v-model="themeColors.primary"
            show-alpha
            @change="updateColor('primary')"
          />
        </div>

        <div class="theme-section">
          <h3>{{ t("theme.textColor") }}</h3>
          <div class="color-group">
            <el-color-picker
              v-model="themeColors.textPrimary"
              show-alpha
              @change="updateColor('textPrimary')"
            />
            <el-color-picker
              v-model="themeColors.textRegular"
              show-alpha
              @change="updateColor('textRegular')"
            />
          </div>
        </div>

        <div class="theme-section">
          <h3>{{ t("theme.backgroundColor") }}</h3>
          <el-color-picker
            v-model="themeColors.background"
            show-alpha
            @change="updateColor('background')"
          />
        </div>
      </template>

      <div class="theme-actions">
        <el-button @click="resetTheme">{{ t("theme.reset") }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { defaultTheme } from "@/config/theme";
import { Moon, Sunny } from "@element-plus/icons-vue";

const { t } = useI18n();
const visible = ref(false);
const themeStore = useThemeStore();
const { isDark, currentTheme } = storeToRefs(themeStore);

const themeColors = reactive({ ...currentTheme.value });

const updateColor = (key: string) => {
  themeStore.updateTheme({ [key]: themeColors[key] });
};

const toggleTheme = (value: boolean) => {
  themeStore.toggleDarkMode(value);
};

const resetTheme = () => {
  Object.assign(themeColors, defaultTheme);
  themeStore.updateTheme(defaultTheme);
};

defineExpose({
  open: () => (visible.value = true),
});
</script>

<style scoped lang="scss">
.theme-config {
  padding: 20px;

  .theme-section {
    margin-bottom: 30px;

    h3 {
      margin: 0 0 15px;
      color: var(--el-text-color-primary);
    }

    .color-group {
      display: flex;
      gap: 15px;
    }
  }

  .theme-actions {
    margin-top: 40px;
    text-align: center;
  }
}
</style>
