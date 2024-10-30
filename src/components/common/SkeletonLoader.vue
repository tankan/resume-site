<template>
  <div class="skeleton-loader" :class="{ 'is-loading': loading }">
    <div v-if="loading" class="skeleton-content">
      <div
        v-for="(item, index) in count"
        :key="index"
        class="skeleton-item"
        :style="{ height: `${height}px` }"
      >
        <div class="skeleton-animation"></div>
      </div>
    </div>
    <div v-else>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  loading: {
    type: Boolean,
    default: true,
  },
  count: {
    type: Number,
    default: 1,
  },
  height: {
    type: Number,
    default: 20,
  },
});
</script>

<style scoped lang="scss">
.skeleton-loader {
  width: 100%;

  .skeleton-item {
    background: var(--el-fill-color-light);
    border-radius: 4px;
    margin-bottom: 12px;
    overflow: hidden;
    position: relative;

    .skeleton-animation {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        var(--el-fill-color-light) 25%,
        var(--el-fill-color) 37%,
        var(--el-fill-color-light) 63%
      );
      background-size: 400% 100%;
      animation: skeleton-loading 1.4s ease infinite;
    }
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>
