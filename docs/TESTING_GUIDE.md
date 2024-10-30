# 测试指南

## 单元测试

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

### Store 测试
```typescript
describe('ThemeStore', () => {
  it('updates theme correctly', () => {
    const store = useThemeStore()
    store.updateTheme({ primary: '#ff0000' })
    expect(store.currentTheme.primary).toBe('#ff0000')
  })
})
```

### 工具函数测试
```typescript
describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-01')
    expect(formatDate(date)).toBe('2024-01-01')
  })
})
```

## E2E 测试

### 页面导航
```typescript
describe('Navigation', () => {
  it('navigates through main pages', () => {
    cy.visit('/')
    cy.contains('关于我').click()
    cy.url().should('include', '/about')
  })
})
```

### 功能测试
```typescript
describe('Theme Configuration', () => {
  it('changes theme color', () => {
    cy.get('[data-test="theme-config"]').click()
    cy.get('[data-test="color-picker"]').click()
    cy.get('.theme-preview').should('have.css', 'background-color')
  })
})
```

### 性能测试
```typescript
describe('Performance', () => {
  it('loads within acceptable time', () => {
    cy.visit('/')
    cy.window().then((win) => {
      const performance = win.performance
      expect(performance.timing.loadEventEnd - 
             performance.timing.navigationStart).to.be.lessThan(3000)
    })
  })
})
```

## 最佳实践

### 测试原则
- 测试行为而非实现
- 保持测试独立性
- 避免测试实现细节
- 使用有意义的断言

### 测试覆盖率
- 关键功能 100%
- 业务逻辑 80%
- UI 组件 70%
- 工具函数 90%

### 测试维护
- 定期更新测试
- 删除过时测试
- 优化测试性能
- 保持测试简单

### 持续集成
- 提交前运行测试
- 自动化测试流程
- 测试报告生成
- 覆盖率监控 