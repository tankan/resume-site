# 贡献指南

感谢你考虑为本项目做出贡献！

## 开发流程

1. Fork 本仓库
2. 克隆你的 Fork
3. 创建特性分支
4. 提交更改
5. 推送到你的 Fork
6. 创建 Pull Request

## 开发规范

### Git 提交规范

使用 Angular 提交规范：

- feat: 新功能
- fix: 修复
- docs: 文档更新
- style: 代码格式
- refactor: 重构
- test: 测试
- chore: 构建过程或辅助工具的变动

### 代码风格

项目使用 ESLint 和 Prettier 进行代码规范和格式化：
```bash
# 运行代码检查
npm run lint
# 格式化代码
npm run format
```

### TypeScript

- 尽可能使用 TypeScript 类型
- 避免使用 any
- 为函数添加返回类型

### 测试

- 为新功能添加单元测试
- 为重要功能添加 E2E 测试
- 保持测试覆盖率

## 分支策略

- main: 主分支，用于发布
- develop: 开发分支
- feature/*: 特性分支
- bugfix/*: 修复分支
- release/*: 发布分支

## 发布流程

1. 从 develop 创建 release 分支
2. 更新版本号
3. 运行测试
4. 合并到 main
5. 打标签
6. 发布

## 问题反馈

- 使用 GitHub Issues
- 提供复现步骤
- 附上错误日志
- 说明运行环境

