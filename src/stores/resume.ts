import { defineStore } from "pinia";
import { ref } from "vue";
import type { Ref } from "vue";
import type { Profile } from '@/types'
import { useStorage } from "@vueuse/core";
import { ElMessage } from 'element-plus';

export const useResumeStore = defineStore("resume", () => {
  // 个人信息
  const profile = useStorage<Profile>("resume-profile", {
    name: "张三",
    title: "高级前端工程师",
    avatar: "/images/avatar.jpg",
    email: "zhangsan@example.com",
    phone: "13800138000",
    location: "北京",
    github: "https://github.com/example",
    description:
      "10年前端开发经验，专注于现代化前端架构设计与性能优化，擅长Vue.js生态系统开发。",
  });

  // 主题设置
  const isDark = useStorage("resume-theme-dark", false);

  // PDF 简历地址
  const resumeUrl: Ref<string> = ref("/resume.pdf");

  // 生成简历 PDF
  const generatePDF = async () => {
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile: profile.value,
        }),
      });

      if (!response.ok) throw new Error("PDF 生成失败");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      resumeUrl.value = url;

      return url;
    } catch (error) {
      console.error("生成 PDF 失败:", error);
      throw error;
    }
  };

  // 下载简历
  const downloadResume = async () => {
    try {
      const url = await generatePDF();
      const link = document.createElement("a");
      link.href = url;
      link.download = `${profile.value.name}-简历.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (_error) {
      ElMessage.error("简历下载失败，请稍后重试");
    }
  };

  return {
    profile,
    isDark,
    resumeUrl,
    generatePDF,
    downloadResume,
  };
});
