# PWA 文档

## 功能特性

### 离线支持
- Service Worker 缓存
- 离线页面访问
- 资源缓存策略
- 后台同步

### 安装体验
- 添加到主屏幕
- 启动画面
- 应用图标
- 主题颜色

### 性能优化
- 预缓存
- 运行时缓存
- 缓存更新
- 网络优先策略

## 配置说明

### Manifest 配置
```json
{
  "name": "前端工程师简历",
  "short_name": "简历",
  "description": "个人简历网站",
  "theme_color": "#409eff",
  "icons": [
    {
      "src": "pwa-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "pwa-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker 配置
```typescript
// Workbox 配置
workbox: {
  cleanupOutdatedCaches: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-cache',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
        }
      }
    }
  ]
}
```

## 开发指南

### 资源缓存
- 静态资源缓存
- API 请求缓存
- 图片缓存
- 字体缓存

### 更新策略
- 自动更新
- 提示更新
- 强制更新
- 后台更新

### 离线功能
- 离线页面
- 离线数据
- 离线通知
- 后台同步

## 最佳实践

### 性能优化
- 合理的缓存策略
- 资源预加载
- 按需加载
- 压缩优化

### 用户体验
- 安装提示
- 更新提示
- 离线提示
- 加载状态 