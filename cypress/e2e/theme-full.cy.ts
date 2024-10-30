describe('Theme System', () => {
  beforeEach(() => {
    cy.visit('/')
    // 清除主题相关的本地存储
    cy.clearLocalStorage('resume-theme-dark')
    cy.clearLocalStorage('resume-theme-custom')
  })

  it('should handle theme switching with transitions', () => {
    // 检查主题切换动画
    cy.get('[data-test="theme-switch"]').click()
    cy.get('html')
      .should('have.class', 'dark')
      .and('have.css', 'transition-property', 'background-color')
      .and('have.css', 'transition-duration', '0.3s')

    // 验证颜色变化
    cy.get('body')
      .should('have.css', 'background-color', 'rgb(29, 30, 31)') // 暗色模式背景色
  })

  it('should customize and persist theme colors', () => {
    // 打开主题配置
    cy.get('[data-test="theme-config-button"]').click()

    // 设置自定义主题色
    const customColors = {
      primary: '#ff0000',
      textPrimary: '#333333',
      background: '#f5f5f5'
    }

    // 修改每个颜色
    Object.entries(customColors).forEach(([key, value]) => {
      cy.get(`[data-test="${key}-color-picker"]`)
        .click()
        .invoke('val', value)
        .trigger('change')
        .trigger('blur')
    })

    // 刷新页面
    cy.reload()

    // 验证颜色持久化
    cy.get(':root').should('have.css', '--el-color-primary', 'rgb(255, 0, 0)')
    cy.get(':root').should('have.css', '--custom-textPrimary', 'rgb(51, 51, 51)')
    cy.get(':root').should('have.css', '--custom-background', 'rgb(245, 245, 245)')
  })

  it('should sync theme across browser tabs', () => {
    // 在新标签页中打开
    cy.window().then((win) => {
      const newWin = win.open('/')
      
      // 在原标签页中修改主题
      cy.get('[data-test="theme-config-button"]').click()
      cy.get('[data-test="primary-color-picker"]')
        .click()
        .invoke('val', '#ff0000')
        .trigger('change')
      
      // 验证新标签页是否同步
      cy.wrap(newWin).its('document')
        .then((doc) => {
          expect(doc.documentElement.style.getPropertyValue('--el-color-primary'))
            .to.equal('rgb(255, 0, 0)')
        })
    })
  })

  it('should handle theme reset correctly', () => {
    // 设置自定义主题
    cy.get('[data-test="theme-config-button"]').click()
    cy.get('[data-test="primary-color-picker"]')
      .click()
      .invoke('val', '#ff0000')
      .trigger('change')

    // 重置主题
    cy.contains('恢复默认').click()

    // 验证是否恢复默认值
    cy.get(':root')
      .should('have.css', '--el-color-primary', 'rgb(64, 158, 255)')
      .and('have.css', '--custom-textPrimary', 'rgb(48, 49, 51)')
      .and('have.css', '--custom-background', 'rgb(255, 255, 255)')
  })
}) 