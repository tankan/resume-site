# 前端工程师简历网站

一个基于 Vue 3 + TypeScript 的现代化简历网站。

## 特性

- 🚀 Vue 3 + TypeScript + Vite
- 📱 响应式设计，支持移动端
- 🌓 明暗主题切换
- 🌍 国际化支持
- 🎨 主题定制
- 📊 性能监控
- 🔍 SEO 优化
- 📄 PDF 导出
- 🔒 错误边界处理
- ⚡️ PWA 支持

## 技术栈

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- Element Plus
- VueUse
- Vue I18n
- Vitest
- Cypress
- PWA

## 开发

```bash
# 安装依赖
npm install
# 启动开发服务器
npm run dev
# 构建生产版本
npm run build
# 预览生产构建
npm run preview
# 运行单元测试
npm run test
# 运行 E2E 测试
npm run test:e2e
# 运行代码检查
npm run lint
# 格式化代码
npm run format
```

## 项目结构
src/
├── assets/ # 静态资源
├── components/ # 组件
├── composables/ # 组合式函数
├── config/ # 配置文件
├── locales/ # 国际化文件
├── router/ # 路由配置
├── services/ # 服务
├── stores/ # 状态管理
├── types/ # 类型定义
├── utils/ # 工具函数
└── views/ # 页面组件

## 功能

### 主题定制
- 支持明暗主题切换
- 自定义主题色
- 主题配置本地存储

### 国际化
- 支持中英文切换
- 动态加载语言包
- 语言偏好记忆

### 性能优化
- 路由懒加载
- 组件按需加载
- 资源预加载
- Gzip 压缩
- 缓存优化

### 开发体验
- TypeScript 支持
- ESLint + Prettier
- Git Hooks
- 自动化测试
- 热更新

## 部署

项目使用 GitHub Actions 进行自动化部署：

1. 推送到 main 分支会触发自动构建
2. 运行测试和代码检查
3. 构建生产版本
4. 部署到 GitHub Pages

## 贡献

1. Fork 本仓库
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可

[MIT](LICENSE)