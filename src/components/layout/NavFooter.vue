<template>
  <footer class="nav-footer">
    <div class="contact-info">
      <el-space wrap>
        <el-link :href="'mailto:' + email" type="primary">
          <el-icon><i-ep-message /></el-icon>
          {{ email }}
        </el-link>
        <el-link :href="github" target="_blank" type="primary">
          <el-icon><i-ep-link /></el-icon>
          GitHub
        </el-link>
      </el-space>
    </div>
    <div class="copyright">
      © {{ new Date().getFullYear() }} 前端工程师简历. All Rights Reserved.
    </div>
  </footer>
</template>

<script setup lang="ts">
const email = "me@zengxingqi.com";
const github = "https://github.com/themages";
</script>

<style scoped lang="scss">
.nav-footer {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid $border-color;

  .contact-info {
    margin-bottom: 8px;
  }

  .copyright {
    color: $text-secondary;
    font-size: 14px;
  }
}
</style>
