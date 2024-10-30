describe('Internationalization', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should switch between languages', () => {
    // 默认中文
    cy.contains('h1', '前端工程师简历').should('be.visible')
    cy.contains('关于我').should('be.visible')
    
    // 切换到英文
    cy.get('[data-test="language-switch"]').click()
    cy.contains('English').click()
    
    cy.contains('h1', 'Frontend Engineer Resume').should('be.visible')
    cy.contains('About').should('be.visible')
    
    // 切换回中文
    cy.get('[data-test="language-switch"]').click()
    cy.contains('中文').click()
    
    cy.contains('h1', '前端工程师简历').should('be.visible')
  })

  it('should persist language preference', () => {
    // 切换到英文
    cy.get('[data-test="language-switch"]').click()
    cy.contains('English').click()
    
    // 刷新页面
    cy.reload()
    
    // 应该保持英文
    cy.contains('h1', 'Frontend Engineer Resume').should('be.visible')
  })

  it('should apply translations to dynamic content', () => {
    // 切换到英文
    cy.get('[data-test="language-switch"]').click()
    cy.contains('English').click()
    
    // 检查动态内容翻译
    cy.get('[data-test="theme-config-button"]').click()
    cy.contains('Theme Settings').should('be.visible')
    cy.contains('Primary Color').should('be.visible')
  })
}) 