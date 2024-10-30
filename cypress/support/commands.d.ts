/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * 自定义登录命令
     * @example cy.login('test@example.com', 'password123')
     */
    login(email: string, password: string): Chainable<void>

    /**
     * 通过测试 ID 选择元素
     * @example cy.getByTestId('submit-button')
     */
    getByTestId(testId: string): Chainable<JQuery<HTMLElement>>

    /**
     * 等待性能指标收集完成
     * @example cy.waitForPerformanceMetrics()
     */
    waitForPerformanceMetrics(): Chainable<{
      fcp: number
      lcp: number
      cls: number
      fid: number
      ttfb: number
    }>

    /**
     * 检查颜色对比度
     * @example cy.checkColorContrast('.text', '.background')
     */
    checkColorContrast(textSelector: string, bgSelector: string): Chainable<number>

    /**
     * 模拟网络状态
     * @example cy.mockNetworkCondition('offline')
     */
    mockNetworkCondition(condition: 'offline' | 'online'): Chainable<void>

    /**
     * 检查元素可访问性
     * @example cy.checkA11y('.button')
     */
    checkA11y(selector: string): Chainable<void>

    /**
     * 切换主题模式
     * @example cy.toggleTheme()
     */
    toggleTheme(): Chainable<void>

    /**
     * 切换语言
     * @example cy.switchLanguage('en-US')
     */
    switchLanguage(lang: 'zh-CN' | 'en-US'): Chainable<void>

    /**
     * 检查响应式布局
     * @example cy.checkResponsive('mobile')
     */
    checkResponsive(viewport: 'mobile' | 'tablet' | 'desktop'): Chainable<void>
  }
} 