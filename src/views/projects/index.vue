<template>
  <div class="projects-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="projects-filter">
          <el-radio-group v-model="currentTag" @change="filterProjects">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button v-for="tag in projectTags" :key="tag" :label="tag">
              {{ tag }}
            </el-radio-button>
          </el-radio-group>
        </div>
      </el-col>

      <el-col
        v-for="project in filteredProjects"
        :key="project.id"
        :xs="24"
        :sm="12"
        :md="8"
      >
        <el-card class="project-card" :body-style="{ padding: '0px' }">
          <div class="project-image">
            <el-image :src="project.image" fit="cover" loading="lazy">
              <template #error>
                <div class="image-placeholder">
                  <el-icon><i-ep-picture /></el-icon>
                </div>
              </template>
            </el-image>
          </div>
          <div class="project-content">
            <h3>{{ project.name }}</h3>
            <div class="project-tags">
              <el-tag
                v-for="tag in project.tags"
                :key="tag"
                size="small"
                effect="plain"
              >
                {{ tag }}
              </el-tag>
            </div>
            <p class="project-description">{{ project.description }}</p>

            <div class="project-highlights">
              <h4>项目亮点：</h4>
              <ul>
                <li
                  v-for="(highlight, index) in project.highlights"
                  :key="index"
                >
                  {{ highlight }}
                </li>
              </ul>
            </div>

            <div class="project-actions">
              <el-button
                v-if="project.demoUrl"
                type="primary"
                link
                @click="openUrl(project.demoUrl)"
              >
                在线演示
              </el-button>
              <el-button
                v-if="project.sourceUrl"
                type="success"
                link
                @click="openUrl(project.sourceUrl)"
              >
                源码
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Picture } from "@element-plus/icons-vue";

interface Project {
  id: number;
  name: string;
  description: string;
  image: string;
  tags: string[];
  highlights: string[];
  demoUrl?: string;
  sourceUrl?: string;
}

const projects: Project[] = [
  {
    id: 1,
    name: "企业级微前端应用平台",
    description:
      "基于 qiankun 的企业级微前端应用平台，实现多个子应用的统一管理和协同",
    image: "/images/projects/micro-frontend.jpg",
    tags: ["微前端", "Vue3", "TypeScript", "qiankun"],
    highlights: [
      "设计并实现了基于 qiankun 的微前端架构",
      "解决了多个子应用间的状态共享和通信问题",
      "实现了子应用的按需加载和预加载策略",
      "优化了应用加载性能，首屏加载时间减少 50%",
    ],
    demoUrl: "https://demo.example.com",
    sourceUrl: "https://github.com/example/micro-frontend",
  },
  {
    id: 2,
    name: "低代码平台",
    description: "企业级低代码开发平台，支持拖拽式开发和可视化配置",
    image: "/images/projects/low-code.jpg",
    tags: ["低代码", "Vue3", "TypeScript", "Canvas"],
    highlights: [
      "实现了可视化拖拽开发界面",
      "设计了组件属性配置系统",
      "开发了自定义组件开发SDK",
      "支持组件间逻辑流程配置",
    ],
  },
  {
    id: 3,
    name: "数据可视化平台",
    description:
      "基于 ECharts 的大数据可视化平台，支持多种图表类型和实时数据展示",
    image: "/images/projects/data-vis.jpg",
    tags: ["可视化", "ECharts", "WebSocket", "Vue3"],
    highlights: [
      "使用 ECharts 实现多种复杂图表",
      "实现了图表的实时数据更新",
      "开发了图表配置生成器",
      "优化了大数据量下的渲染性能",
    ],
    demoUrl: "https://vis-demo.example.com",
  },
];

const currentTag = ref("all");
const projectTags = computed(() => {
  const tags = new Set<string>();
  projects.forEach((project) => {
    project.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags);
});

const filteredProjects = computed(() => {
  if (currentTag.value === "all") return projects;
  return projects.filter((project) => project.tags.includes(currentTag.value));
});

const openUrl = (url: string) => {
  window.open(url, "_blank");
};

const filterProjects = (tag: string) => {
  currentTag.value = tag;
};
</script>

<style scoped lang="scss">
.projects-container {
  padding: 20px;

  .projects-filter {
    margin-bottom: 30px;
    text-align: center;
  }

  .project-card {
    margin-bottom: 20px;
    transition: transform 0.3s;

    &:hover {
      transform: translateY(-5px);
    }

    .project-image {
      height: 200px;
      overflow: hidden;

      .el-image {
        width: 100%;
        height: 100%;
      }

      .image-placeholder {
        height: 100%;
        background-color: #f5f7fa;
        display: flex;
        align-items: center;
        justify-content: center;

        .el-icon {
          font-size: 40px;
          color: #909399;
        }
      }
    }

    .project-content {
      padding: 20px;

      h3 {
        margin: 0 0 15px;
        color: $text-primary;
      }

      .project-tags {
        margin-bottom: 15px;

        .el-tag {
          margin-right: 8px;
          margin-bottom: 8px;
        }
      }

      .project-description {
        color: $text-regular;
        margin-bottom: 15px;
        line-height: 1.5;
      }

      .project-highlights {
        margin-bottom: 20px;

        h4 {
          color: $text-primary;
          margin: 0 0 10px;
        }

        ul {
          padding-left: 20px;
          margin: 0;

          li {
            color: $text-regular;
            margin-bottom: 5px;
            line-height: 1.4;
          }
        }
      }

      .project-actions {
        display: flex;
        gap: 15px;
        justify-content: flex-end;
      }
    }
  }
}

// 响应式布局
@media (max-width: 768px) {
  .projects-container {
    .project-card {
      .project-image {
        height: 150px;
      }
    }
  }
}
</style>
