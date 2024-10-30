<template>
  <el-container class="layout-container">
    <el-header height="60px">
      <nav-header />
    </el-header>

    <el-main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>

    <el-footer height="60px">
      <nav-footer />
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import NavHeader from "@/components/layout/NavHeader.vue";
import NavFooter from "@/components/layout/NavFooter.vue";
</script>

<style scoped lang="scss">
.layout-container {
  min-height: 100vh;

  .el-header {
    background-color: #fff;
    border-bottom: 1px solid $border-color;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 100;
  }

  .el-main {
    padding-top: $header-height;
    background-color: #f5f7fa;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
