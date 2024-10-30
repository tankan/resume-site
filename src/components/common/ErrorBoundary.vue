<template>
  <div v-if="error" class="error-boundary">
    <el-result
      status="error"
      :title="t('error.title')"
      :sub-title="t('error.message')"
    >
      <template #extra>
        <el-space>
          <el-button type="primary" @click="handleRetry">
            {{ t("error.retry") }}
          </el-button>
          <el-button @click="handleBack">
            {{ t("error.back") }}
          </el-button>
        </el-space>
      </template>
      <template v-if="isDev" #icon>
        <div class="error-details">
          <h4>{{ t("error.details") }}</h4>
          <pre>{{ error.stack }}</pre>
        </div>
      </template>
    </el-result>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  onRetry?: () => void;
}>();

const { t } = useI18n();
const router = useRouter();
const error = ref<Error | null>(null);
const isDev = import.meta.env.DEV;

onErrorCaptured((err: Error) => {
  error.value = err;
  return false;
});

const handleRetry = () => {
  error.value = null;
  if (props.onRetry) {
    props.onRetry();
  } else {
    window.location.reload();
  }
};

const handleBack = () => {
  error.value = null;
  router.push("/");
};
</script>

<style scoped lang="scss">
.error-boundary {
  padding: 40px;

  .error-details {
    margin-top: 20px;
    text-align: left;

    h4 {
      margin: 0 0 10px;
      color: var(--el-text-color-primary);
    }

    pre {
      padding: 16px;
      background: var(--el-bg-color-page);
      border-radius: 4px;
      color: var(--el-text-color-regular);
      font-size: 14px;
      overflow-x: auto;
    }
  }
}
</style>
