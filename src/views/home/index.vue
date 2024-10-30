<template>
  <div class="home-container">
    <el-row :gutter="20">
      <el-col :span="16">
        <div class="profile-section">
          <div class="avatar-wrapper">
            <el-avatar :size="120" src="avatar-url" />
          </div>
          <div class="intro-text">
            <h1>{{ profile.name }}</h1>
            <h2>{{ profile.title }}</h2>
            <p>{{ profile.description }}</p>
          </div>
          <div class="action-buttons">
            <el-button type="primary" size="large" @click="contactMe">
              联系我
            </el-button>
            <el-button size="large" @click="viewProjects"> 查看项目 </el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="info-card">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>个人信息</span>
              </div>
            </template>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="工作年限">
                {{ profile.experience }}年
              </el-descriptions-item>
              <el-descriptions-item label="当前状态">
                {{ profile.status }}
              </el-descriptions-item>
              <el-descriptions-item label="所在城市">
                {{ profile.location }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </div>
      </el-col>
    </el-row>

    <el-row class="skills-overview">
      <el-col :span="24">
        <h2>核心技能</h2>
        <el-space wrap>
          <el-tag
            v-for="skill in skills"
            :key="skill"
            :type="getTagType()"
            effect="dark"
          >
            {{ skill }}
          </el-tag>
        </el-space>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const profile = reactive({
  name: "张三",
  title: "高级前端工程师",
  description:
    "10年前端开发经验，专注于现代化前端架构设计与性能优化，擅长Vue.js生态系统开发。",
  experience: 10,
  status: "在职",
  location: "北京",
});

const skills = [
  "Vue.js",
  "TypeScript",
  "Node.js",
  "Webpack",
  "微前端",
  "前端架构",
  "性能优化",
  "响应式设计",
];

type TagType = "primary" | "success" | "warning" | "info" | "danger";

const getTagType = (): TagType => {
  const types: TagType[] = ["primary", "success", "warning", "info", "danger"];
  return types[Math.floor(Math.random() * types.length)];
};

const contactMe = () => {
  // 实现联系功能
};

const viewProjects = () => {
  router.push("/projects");
};
</script>

<style scoped lang="scss">
.home-container {
  padding: 20px;

  .profile-section {
    background: #fff;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    .avatar-wrapper {
      margin-bottom: 20px;
    }

    .intro-text {
      margin-bottom: 30px;

      h1 {
        font-size: 32px;
        margin-bottom: 10px;
        color: $text-primary;
      }

      h2 {
        font-size: 24px;
        color: $primary-color;
        margin-bottom: 20px;
      }

      p {
        color: $text-regular;
        line-height: 1.6;
      }
    }

    .action-buttons {
      display: flex;
      gap: 20px;
    }
  }

  .info-card {
    height: 100%;
  }

  .skills-overview {
    margin-top: 40px;

    h2 {
      margin-bottom: 20px;
      color: $text-primary;
    }

    .el-tag {
      margin: 5px;
    }
  }
}
</style>
