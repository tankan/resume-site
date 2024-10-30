# 测试文档

## 测试策略

### 单元测试
- 使用 Vitest
- 组件测试
- 工具函数测试
- Store 测试

### E2E 测试
- 使用 Cypress
- 页面功能测试
- 用户交互测试
- 性能测试

## 测试用例

### 组件测试
```typescript
describe('SkeletonLoader', () => {
  it('renders skeleton items when loading', () => {
    const { container } = renderWithPlugins(SkeletonLoader, {
      props: {
        loading: true,
        count: 3
      }
    })
    
    const skeletonItems = container.querySelectorAll('.skeleton-item')
    expect(skeletonItems.length).toBe(3)
  })
})
```

### E2E 测试
```typescript
describe('Navigation', () => {
  it('should navigate through all main pages', () => {
    cy.visit('/')
    cy.contains('关于我').click()
    cy.url().should('include', '/about')
  })
})
```

## 测试覆盖率

### 目标覆盖率
- 语句覆盖率: 80%
- 分支覆盖率: 70%
- 函数覆盖率: 80%
- 行覆盖率: 80%

### 覆盖率报告
```bash
npm run test:coverage
```

## 最佳实践

### 单元测试
- 测试独立性
- 避免测试实现细节
- 使用有意义的断言
- 合理使用 mock

### E2E 测试
- 关注用户流程
- 测试关键功能
- 避免脆弱的测试
- 合理使用等待

## 开发指南

### 添加测试
1. 确定测试范围
2. 编写测试用例
3. 运行测试
4. 检查覆盖率

### 维护测试
1. 定期更新测试
2. 修复失败的测试
3. 优化测试性能
4. 清理冗余测试 