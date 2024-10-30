# 性能优化指南

## 构建优化

### 代码分割
- 路由级别的代码分割
- 组件级别的动态导入
- 第三方库的分包策略

### 资源优化
- 图片懒加载和压缩
- 字体文件优化
- CSS 和 JavaScript 压缩
- Gzip/Brotli 压缩

### 缓存策略
```javascript
// Service Worker 缓存配置
workbox: {
  runtimeCaching: [
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
        }
      }
    }
  ]
}
```

## 运行时优化

### 首屏加载
- 关键资源预加载
- 非关键资源延迟加载
- 骨架屏优化
- 路由预加载

### 渲染优化
```typescript
// 虚拟列表示例
const useVirtualList = (list: any[], size: number) => {
  const startIndex = computed(() => 
    Math.floor(scrollTop.value / size)
  )
  
  const visibleItems = computed(() => 
    list.slice(startIndex.value, startIndex.value + visibleCount.value)
  )
}
```

### 状态管理优化
- 合理使用计算属性
- 避免不必要的响应式
- Store 模块化设计
- 状态持久化策略

## 监控与分析

### 性能指标
- FCP (First Contentful Paint)
- LCP (Largest Contentful Paint)
- TTI (Time to Interactive)
- TBT (Total Blocking Time)

### 监控实现
```typescript
// 性能指标收集
const collectMetrics = () => {
  const paint = performance.getEntriesByType('paint')
  const fcp = paint.find(entry => entry.name === 'first-contentful-paint')
  return {
    fcp: fcp?.startTime || 0
  }
}
```

## 最佳实践

### 代码层面
- 使用 PureComponent
- 合理使用 v-show/v-if
- 避免深层组件嵌套
- 使用函数式组件

### 资源层面
- 使用 CDN 加速
- WebP 图片格式
- 字体子集化
- 资源预连接

### 构建层面
- Tree Shaking
- Scope Hoisting
- 现代模式构建
- 依赖优化 