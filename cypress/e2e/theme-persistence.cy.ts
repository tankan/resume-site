describe('Theme Persistence', () => {
  beforeEach(() => {
    cy.visit('/')
    // 清除主题相关的本地存储
    cy.clearLocalStorage('resume-theme-dark')
    cy.clearLocalStorage('resume-theme-custom')
  })

  it('should persist dark mode preference', () => {
    // 切换到暗色模式
    cy.get('[data-test="theme-switch"]').click()
    cy.get('html').should('have.class', 'dark')

    // 刷新页面
    cy.reload()
    cy.get('html').should('have.class', 'dark')
  })

  it('should persist custom theme colors', () => {
    // 打开主题配置
    cy.get('[data-test="theme-config-button"]').click()

    // 设置自定义主题色
    const customColor = '#ff0000'
    cy.get('[data-test="primary-color-picker"]')
      .click()
      .invoke('val', customColor)
      .trigger('change')

    // 刷新页面
    cy.reload()

    // 验证主题色是否保持
    cy.get(':root').should('have.css', '--el-color-primary', 'rgb(255, 0, 0)')
  })

  it('should sync theme across tabs', () => {
    // 在新标签页中打开
    cy.window().then((win) => {
      const newWin = win.open('/')
      
      // 在原标签页中切换主题
      cy.get('[data-test="theme-switch"]').click()
      
      // 验证新标签页是否同步
      cy.wrap(newWin).its('document')
        .then((doc) => {
          expect(doc.documentElement).to.have.class('dark')
        })
    })
  })

  it('should reset theme to default', () => {
    // 设置自定义主题
    cy.get('[data-test="theme-config-button"]').click()
    cy.get('[data-test="primary-color-picker"]')
      .click()
      .invoke('val', '#ff0000')
      .trigger('change')

    // 重置主题
    cy.contains('恢复默认').click()

    // 验证是否恢复默认值
    cy.get(':root').should('have.css', '--el-color-primary', 'rgb(64, 158, 255)')
  })
}) 