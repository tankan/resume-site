# Cypress 自定义命令文档

## 认证相关命令

### login
登录命令，用于模拟用户登录。
```typescript
cy.login(email: string, password: string)
```
示例：
```typescript
cy.login('test@example.com', 'password123')
```

## 主题相关命令

### toggleTheme
切换明暗主题。
```typescript
cy.toggleTheme()
```

### setThemeColor
设置主题颜色。
```typescript
cy.setThemeColor(color: string)
```
示例：
```typescript
cy.setThemeColor('#ff0000')
```

### checkThemePersistence
检查主题持久化。
```typescript
cy.checkThemePersistence()
```

## 国际化相关命令

### switchLanguage
切换语言。
```typescript
cy.switchLanguage(lang: 'zh-CN' | 'en-US')
```
示例：
```typescript
cy.switchLanguage('en-US')
```

### checkTranslation
检查翻译是否正确。
```typescript
cy.checkTranslation(key: string, lang: 'zh-CN' | 'en-US')
```

## 性能监控命令

### checkPerformanceMetrics
收集性能指标。
```typescript
cy.checkPerformanceMetrics()
```
返回值：
```typescript
{
  fcp: number  // First Contentful Paint
  lcp: number  // Largest Contentful Paint
  cls: number  // Cumulative Layout Shift
  fid: number  // First Input Delay
  ttfb: number // Time to First Byte
}
```

### checkResourceTiming
检查资源加载性能。
```typescript
cy.checkResourceTiming(resourceType: string)
```

## 可访问性命令

### checkA11y
检查元素的可访问性。
```typescript
cy.checkA11y(selector: string)
```
示例：
```typescript
cy.checkA11y('.nav-button')
```

### checkColorContrast
检查颜色对比度。
```typescript
cy.checkColorContrast(textSelector: string, bgSelector: string)
```

## 响应式测试命令

### checkResponsive
检查响应式布局。
```typescript
cy.checkResponsive(viewport: 'mobile' | 'tablet' | 'desktop')
```
示例：
```typescript
cy.checkResponsive('mobile')
```

### checkVirtualScroll
检查虚拟滚动功能。
```typescript
cy.checkVirtualScroll(containerSelector: string, itemSelector: string)
```

## PWA 相关命令

### checkPWAFeatures
检查 PWA 功能。
```typescript
cy.checkPWAFeatures()
```

### mockServiceWorker
模拟 Service Worker。
```typescript
cy.mockServiceWorker()
```

### testOfflineMode
测试离线模式。
```typescript
cy.testOfflineMode()
```

## 错误处理命令

### mockError
模拟错误响应。
```typescript
cy.mockError(status: number, message: string)
```
示例：
```typescript
cy.mockError(500, '服务器错误')
```

### checkErrorRecovery
检查错误恢复机制。
```typescript
cy.checkErrorRecovery()
```

## 表单相关命令

### validateForm
验证表单。
```typescript
cy.validateForm(formSelector: string, data: Record<string, any>)
```

### uploadFile
上传文件。
```typescript
cy.uploadFile(selector: string, fileName: string, fileType: string)
```

## 动画相关命令

### checkAnimation
检查动画效果。
```typescript
cy.checkAnimation(selector: string, animationName: string)
```

### waitForAnimation
等待动画完成。
```typescript
cy.waitForAnimation(selector: string)
```

## 最佳实践

1. 命令使用建议：
   - 保持命令的原子性
   - 避免在命令中使用硬编码值
   - 添加适当的等待和重试机制
   - 处理异常情况

2. 性能考虑：
   - 避免不必要的等待
   - 合理使用 timeout
   - 优化选择器性能
   - 减少 DOM 查询次数

3. 可维护性：
   - 保持命令文档更新
   - 添加清晰的示例
   - 使用类型定义
   - 遵循命名规范 