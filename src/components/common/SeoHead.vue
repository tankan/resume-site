<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useResumeStore } from "@/stores/resume";
import { useHead } from "@unhead/vue";

const { t } = useI18n();
const route = useRoute();
const resumeStore = useResumeStore();

const title = computed(() => {
  return t("seo.title", { name: resumeStore.profile.name });
});

const description = computed(() => {
  return t("seo.description");
});

const keywords = computed(() => {
  return t("seo.keywords");
});

const currentUrl = computed(() => {
  return `${window.location.origin}${route.path}`;
});

useHead({
  title,
  meta: [
    { name: "description", content: description },
    { name: "keywords", content: keywords },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "profile" },
    { property: "og:url", content: currentUrl },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ],
});
</script>

<template>
  <!-- 组件不需要模板，因为 useHead 会自动管理 meta 标签 -->
</template>
