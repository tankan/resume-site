<template>
  <div class="about-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="about-card">
          <template #header>
            <div class="card-header">
              <h2>关于我</h2>
            </div>
          </template>

          <div class="about-content">
            <el-timeline>
              <el-timeline-item
                v-for="(experience, index) in experiences"
                :key="index"
                :timestamp="experience.period"
                placement="top"
                :type="getTimelineItemType(index)"
              >
                <el-card>
                  <h3>{{ experience.company }}</h3>
                  <h4>{{ experience.position }}</h4>
                  <div class="experience-content">
                    <p>{{ experience.description }}</p>
                    <ul>
                      <li
                        v-for="(achievement, idx) in experience.achievements"
                        :key="idx"
                      >
                        {{ achievement }}
                      </li>
                    </ul>
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
interface Experience {
  period: string;
  company: string;
  position: string;
  description: string;
  achievements: string[];
}

const experiences: Experience[] = [
  {
    period: "2020 - 至今",
    company: "某科技有限公司",
    position: "高级前端工程师/前端架构师",
    description:
      "负责公司核心产品的前端架构设计和技术选型，带领团队完成多个重要项目。",
    achievements: [
      "设计并实现了基于微前端架构的企业级应用平台",
      "优化前端构建流程，将构建时间减少50%",
      "推动团队代码规范化，提升代码质量",
      "设计实现组件库，提高开发效率30%",
    ],
  },
  {
    period: "2017 - 2020",
    company: "某网络科技公司",
    position: "前端开发工程师",
    description: "参与公司电商平台的开发与维护。",
    achievements: [
      "负责电商平台核心功能开发",
      "实现了复杂的商品推荐系统前端展示",
      "优化页面性能，提升用户体验",
    ],
  },
];

const getTimelineItemType = (index: number) => {
  const types = ["primary", "success", "warning", "info"];
  return types[index % types.length];
};
</script>

<style scoped lang="scss">
.about-container {
  padding: 20px;

  .about-card {
    .card-header {
      h2 {
        margin: 0;
        color: $text-primary;
      }
    }

    .about-content {
      padding: 20px 0;

      :deep(.el-timeline-item__node) {
        z-index: 1;
      }

      .el-card {
        margin-bottom: 10px;

        h3 {
          margin: 0 0 10px;
          color: $primary-color;
        }

        h4 {
          margin: 0 0 15px;
          color: $text-regular;
        }

        .experience-content {
          p {
            margin-bottom: 15px;
            line-height: 1.6;
          }

          ul {
            padding-left: 20px;

            li {
              margin-bottom: 8px;
              line-height: 1.4;
            }
          }
        }
      }
    }
  }
}
</style>
