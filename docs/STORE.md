# 状态管理文档

## Store 设计

### ResumeStore
简历数据管理，包含个人信息、工作经验等。
```typescript
interface ResumeStore {
  profile: {
    name: string
    title: string
    avatar: string
    email: string
    phone: string
    location: string
    github: string
    description: string
  }
  downloadResume: () => Promise<void>
}
```

### ThemeStore
主题配置管理，包含主题模式、颜色等。
```typescript
interface ThemeStore {
  isDark: boolean
  currentTheme: ThemeConfig
  updateTheme: (theme: Partial<ThemeConfig>) => void
}
```

## 最佳实践

### Store 组织
- 按功能模块拆分
- 保持单一职责
- 避免状态冗余

### 状态更新
- 使用 action 修改状态
- 保持状态不可变性
- 处理异步操作

### 性能优化
- 使用 computed 缓存
- 避免不必要的响应式
- 合理使用 storeToRefs

### 持久化
- 使用 useStorage
- 选择性持久化
- 版本控制

## 使用示例

### 在组件中使用
```vue
<script setup>
import { useResumeStore } from '@/stores/resume'
import { storeToRefs } from 'pinia'
const resumeStore = useResumeStore()
const { profile } = storeToRefs(resumeStore)
</script>
```

### 处理异步操作
```typescript
const downloadResume = async () => {
  try {
    await resumeStore.downloadResume()
    ElMessage.success('下载成功')
  } catch (error) {
    ElMessage.error('下载失败')
  }
}
```

## 开发指南

### 创建新 Store
1. 定义接口
2. 实现 Store
3. 添加测试
4. 更新文档

### 修改现有 Store
1. 确保向后兼容
2. 更新测试
3. 更新文档
4. 添加更新日志






