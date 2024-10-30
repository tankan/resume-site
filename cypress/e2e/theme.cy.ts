describe('Theme Configuration', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should open theme config drawer', () => {
    cy.get('[data-test="theme-config-button"]').click()
    cy.get('.theme-config').should('be.visible')
  })

  it('should change primary color', () => {
    cy.get('[data-test="theme-config-button"]').click()
    cy.get('[data-test="primary-color-picker"]').click()
    cy.get('.el-color-dropdown__link-btn').click()
    // 验证颜色是否已更改
    cy.get(':root').should('have.css', '--el-color-primary')
  })

  it('should reset theme', () => {
    cy.get('[data-test="theme-config-button"]').click()
    cy.contains('恢复默认').click()
    // 验证是否恢复默认主题
    cy.get(':root').should('have.css', '--el-color-primary', 'rgb(64, 158, 255)')
  })
}) 