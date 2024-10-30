# 错误处理指南

## 错误类型

### 前端错误
- JavaScript 运行时错误
- Promise 异常
- 网络请求错误
- Vue 组件错误

### 错误边界
```vue
<template>
  <error-boundary>
    <suspense>
      <template #default>
        <async-component />
      </template>
      <template #fallback>
        <loading-component />
      </template>
    </suspense>
  </error-boundary>
</template>
```

## 错误监控

### 全局处理
```typescript
// 全局错误处理器
window.addEventListener('error', (event) => {
  errorService.report({
    type: 'runtime',
    message: event.message,
    stack: event.error?.stack
  })
})

// Promise 错误处理
window.addEventListener('unhandledrejection', (event) => {
  errorService.report({
    type: 'promise',
    message: event.reason?.message
  })
})
```

### 请求错误
```typescript
// Axios 拦截器
axios.interceptors.response.use(
  response => response,
  error => {
    errorService.report({
      type: 'network',
      message: error.message,
      status: error.response?.status
    })
    return Promise.reject(error)
  }
)
```

## 错误恢复

### 自动重试
```typescript
const retryRequest = async (fn: () => Promise<any>, times = 3) => {
  try {
    return await fn()
  } catch (error) {
    if (times === 0) throw error
    return retryRequest(fn, times - 1)
  }
}
```

### 优雅降级
- 本地数据回退
- 功能降级方案
- 离线模式支持
- 错误提示优化

## 最佳实践

### 错误预防
- TypeScript 类型检查
- ESLint 静态分析
- 单元测试覆盖
- 代码审查

### 错误处理
- 使用 try/catch
- 异步错误处理
- 错误信息规范
- 错误上报策略

### 用户体验
- 友好的错误提示
- 重试机制
- 错误恢复方案
- 离线支持 