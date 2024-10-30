# 组件文档

## 通用组件

### ErrorBoundary
错误边界组件，用于捕获和处理组件树中的错误。
```vue
<error-boundary>
  <your-component />
</error-boundary>
```

#### Props
- `onRetry`: 重试回调函数

### SkeletonLoader
骨架屏加载组件，用于内容加载状态的展示。
```vue
<skeleton-loader :loading="true" :count="3" :height="100">
  <your-content />
</skeleton-loader>
```

#### Props
- `loading`: 是否显示加载状态
- `count`: 骨架项数量
- `height`: 骨架项高度

### SeoHead
SEO 头部管理组件，用于管理页面的 meta 信息。
```vue
<seo-head />
```

## 布局组件

### BasicLayout
基础布局组件，包含页头、内容区和页脚。
```vue
<basic-layout>
  <router-view />
</basic-layout>
```

### NavHeader
导航头部组件，包含 logo、导航菜单和操作按钮。

#### 功能
- 主题切换
- 语言切换
- 简历下载

### NavFooter
页脚组件，包含联系方式和版权信息。

## 主题组件

### ThemeConfig
主题配置组件，用于自定义主题设置。

#### 功能
- 明暗主题切换
- 主题色配置
- 文字颜色配置
- 背景色配置

## 最佳实践

### 组件命名
- 使用 PascalCase 命名
- 通用组件使用 Base 前缀
- 布局组件使用 Layout 前缀

### Props 定义
- 使用 TypeScript 类型
- 提供默认值
- 添加验证规则

### 事件处理
- 使用 emit 定义事件
- 遵循单向数据流
- 避免直接修改 props

### 性能优化
- 使用 computed 缓存
- 合理使用 v-show/v-if
- 避免不必要的渲染

### 组件通信
- Props Down, Events Up
- 使用 provide/inject
- 使用 Pinia 状态管理

## 开发指南

### 创建新组件
1. 在对应目录创建组件文件
2. 添加 TypeScript 类型
3. 编写单元测试
4. 更新文档

### 修改现有组件
1. 确保向后兼容
2. 更新测试用例
3. 更新文档
4. 添加更新日志

