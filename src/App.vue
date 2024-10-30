<script setup lang="ts">
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import ErrorBoundary from "@/components/common/ErrorBoundary.vue";
</script>

<template>
  <error-boundary>
    <el-config-provider :locale="zhCn">
      <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transition || 'fade-page'" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-config-provider>
  </error-boundary>
</template>

<style lang="scss">
@use "@/assets/styles/main";
</style>
