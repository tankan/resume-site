import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import PerformanceMonitor from '@/components/performance/PerformanceMonitor.vue'

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/views/layout/BasicLayout.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("@/views/home/index.vue"),
        meta: {
          title: "首页",
          transition: "fade-page",
        },
      },
      {
        path: "about",
        name: "About",
        component: () => import("@/views/about/index.vue"),
        meta: {
          title: "关于我",
          transition: "slide-fade",
        },
      },
      {
        path: "skills",
        name: "Skills",
        component: () => import("@/views/skills/index.vue"),
        meta: {
          title: "技能特长",
          transition: "scale",
        },
      },
      {
        path: "projects",
        name: "Projects",
        component: () => import("@/views/projects/index.vue"),
        meta: {
          title: "项目经验",
          transition: "flip",
        },
      },
      {
        path: '/performance',
        name: 'Performance',
        component: PerformanceMonitor,
        meta: {
          title: 'route.performance'
        }
      }
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach((_to, _from) => {
  // 添加下划线前缀表示有意不使用的参数
  // ... 路由守卫逻辑
});

export default router;
