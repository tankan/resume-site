/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * 切换主题模式
     * @example cy.toggleTheme()
     */
    toggleTheme(): Chainable<void>

    /**
     * 设置主题颜色
     * @example cy.setThemeColor('#ff0000')
     */
    setThemeColor(color: string): Chainable<void>

    /**
     * 切换语言
     * @example cy.switchLanguage('en-US')
     */
    switchLanguage(lang: 'zh-CN' | 'en-US'): Chainable<void>

    /**
     * 检查性能指标
     * @example cy.checkPerformanceMetrics()
     */
    checkPerformanceMetrics(): Chainable<{
      fcp: number
      lcp: number
      cls: number
    }>

    /**
     * 检查可访问性
     * @example cy.checkA11y('.button')
     */
    checkA11y(selector: string): Chainable<void>

    /**
     * 检查响应式布局
     * @example cy.checkResponsive('mobile')
     */
    checkResponsive(viewport: 'mobile' | 'tablet' | 'desktop'): Chainable<void>
  }
} 