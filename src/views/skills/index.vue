<template>
  <div class="skills-container">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="skill-category">
          <template #header>
            <div class="card-header">
              <h2>技术栈</h2>
            </div>
          </template>

          <div class="skills-content">
            <div
              v-for="(category, index) in skillCategories"
              :key="index"
              class="skill-section"
            >
              <h3>{{ category.name }}</h3>
              <div class="skill-items">
                <div
                  v-for="(skill, idx) in category.skills"
                  :key="idx"
                  class="skill-item"
                >
                  <div class="skill-info">
                    <span class="skill-name">{{ skill.name }}</span>
                    <span class="skill-level">{{ skill.level }}%</span>
                  </div>
                  <el-progress
                    :percentage="skill.level"
                    :color="getProgressColor(skill.level)"
                  />
                  <div class="skill-description">
                    {{ skill.description }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="certificates">
          <template #header>
            <div class="card-header">
              <h2>证书与认证</h2>
            </div>
          </template>

          <el-timeline>
            <el-timeline-item
              v-for="(cert, index) in certificates"
              :key="index"
              :timestamp="cert.date"
              :type="cert.type"
            >
              <h4>{{ cert.name }}</h4>
              <p>{{ cert.organization }}</p>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
interface Skill {
  name: string;
  level: number;
  description: string;
}

interface SkillCategory {
  name: string;
  skills: Skill[];
}

interface Certificate {
  name: string;
  organization: string;
  date: string;
  type: "primary" | "success" | "warning" | "info";
}

const skillCategories: SkillCategory[] = [
  {
    name: "前端开发",
    skills: [
      {
        name: "Vue.js",
        level: 95,
        description:
          "精通 Vue.js 全家桶，包括 Vue3、Vuex、Vue Router、Composition API 等",
      },
      {
        name: "TypeScript",
        level: 90,
        description: "深入理解 TypeScript，能够构建类型安全的大型应用",
      },
      {
        name: "React",
        level: 85,
        description:
          "熟练使用 React 生态系统，包括 Hooks、Redux、React Router 等",
      },
    ],
  },
  {
    name: "工程化工具",
    skills: [
      {
        name: "Webpack",
        level: 88,
        description: "精通 Webpack 配置和优化，能够构建高性能的前端应用",
      },
      {
        name: "Vite",
        level: 92,
        description: "深入理解 Vite 原理，能够配置现代化的开发环境",
      },
    ],
  },
  {
    name: "后端技能",
    skills: [
      {
        name: "Node.js",
        level: 82,
        description: "能够使用 Node.js 开发服务端应用和工具",
      },
      {
        name: "Docker",
        level: 75,
        description: "熟悉容器化技术，能够部署和维护容器化应用",
      },
    ],
  },
];

const certificates: Certificate[] = [
  {
    name: "AWS Certified Developer",
    organization: "Amazon Web Services",
    date: "2023-01",
    type: "primary",
  },
  {
    name: "Professional Scrum Master I",
    organization: "Scrum.org",
    date: "2022-06",
    type: "success",
  },
  {
    name: "Google Analytics Certification",
    organization: "Google",
    date: "2022-03",
    type: "warning",
  },
];

const getProgressColor = (level: number) => {
  if (level >= 90) return "#67C23A";
  if (level >= 80) return "#409EFF";
  if (level >= 70) return "#E6A23C";
  return "#F56C6C";
};
</script>

<style scoped lang="scss">
.skills-container {
  padding: 20px;

  .skill-category {
    .card-header {
      h2 {
        margin: 0;
        color: $text-primary;
      }
    }

    .skills-content {
      .skill-section {
        margin-bottom: 30px;

        h3 {
          color: $primary-color;
          margin-bottom: 20px;
        }

        .skill-items {
          .skill-item {
            margin-bottom: 25px;

            .skill-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;

              .skill-name {
                font-weight: 500;
                color: $text-regular;
              }

              .skill-level {
                color: $text-secondary;
              }
            }

            .skill-description {
              margin-top: 8px;
              font-size: 14px;
              color: $text-secondary;
              line-height: 1.4;
            }
          }
        }
      }
    }
  }

  .certificates {
    .card-header {
      h2 {
        margin: 0;
        color: $text-primary;
      }
    }

    :deep(.el-timeline-item__content) {
      h4 {
        color: $text-primary;
        margin: 0 0 8px;
      }

      p {
        color: $text-secondary;
        margin: 0;
      }
    }
  }
}
</style>
