/// <reference types="cypress" />

// 登录命令
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login')
    cy.get('[data-test="email-input"]').type(email)
    cy.get('[data-test="password-input"]').type(password)
    cy.get('[data-test="login-button"]').click()
    cy.url().should('not.include', '/login')
  })
})

// 主题相关命令
Cypress.Commands.add('toggleTheme', () => {
  cy.get('[data-test="theme-switch"]').click()
})

Cypress.Commands.add('setThemeColor', (color: string) => {
  cy.get('[data-test="theme-config-button"]').click()
  cy.get('[data-test="primary-color-picker"]')
    .click()
    .invoke('val', color)
    .trigger('change')
})

// 语言相关命令
Cypress.Commands.add('switchLanguage', (lang: 'zh-CN' | 'en-US') => {
  cy.get('[data-test="language-switch"]').click()
  cy.contains(lang === 'zh-CN' ? '中文' : 'English').click()
})

// 性能监控命令
Cypress.Commands.add('checkPerformanceMetrics', () => {
  return cy.window().then((win) => {
    const metrics = {
      fcp: 0,
      lcp: 0,
      cls: 0,
      fid: 0,
      ttfb: 0
    }

    // 获取 FCP
    const paint = win.performance.getEntriesByType('paint')
    const fcp = paint.find(entry => entry.name === 'first-contentful-paint')
    if (fcp) {
      metrics.fcp = fcp.startTime
    }

    // 获取 TTFB
    const navigation = win.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    metrics.ttfb = navigation.responseStart - navigation.requestStart

    return metrics
  })
})

// 辅助功能测试命令
Cypress.Commands.add('checkA11y', (selector: string) => {
  cy.get(selector).should('have.attr', 'aria-label')
  cy.get(selector).should('have.attr', 'role')
})

// 响应式测试命令
Cypress.Commands.add('checkResponsive', (viewport: 'mobile' | 'tablet' | 'desktop') => {
  const viewports = {
    mobile: 'iphone-x',
    tablet: 'ipad-2',
    desktop: [1920, 1080]
  }
  
  cy.viewport(viewports[viewport])
})

// 错误处理命令
Cypress.Commands.add('mockError', (status: number, message: string) => {
  cy.intercept('*', {
    statusCode: status,
    body: { message }
  })
}) 