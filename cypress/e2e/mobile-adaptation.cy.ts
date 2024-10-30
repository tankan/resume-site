describe('Mobile Adaptation', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should show mobile menu on small screens', () => {
    // 设置移动端视口
    cy.viewport('iphone-x')

    // 检查移动端菜单按钮
    cy.get('[data-test="mobile-menu-button"]').should('be.visible')
    cy.get('[data-test="mobile-menu-button"]').click()

    // 检查菜单项
    cy.get('.mobile-menu').should('be.visible')
    cy.contains('关于我').should('be.visible')
    cy.contains('技能特长').should('be.visible')
    cy.contains('项目经验').should('be.visible')
  })

  it('should adapt layout for different screen sizes', () => {
    // 移动端布局
    cy.viewport('iphone-x')
    cy.get('.project-card').should('have.css', 'width', '100%')
    cy.get('.skill-section').should('have.css', 'grid-template-columns', '1fr')

    // 平板布局
    cy.viewport('ipad-2')
    cy.get('.project-card').should('have.css', 'width', '50%')
    cy.get('.skill-section').should('have.css', 'grid-template-columns', 'repeat(2, 1fr)')

    // 桌面布局
    cy.viewport(1920, 1080)
    cy.get('.project-card').should('have.css', 'width', '33.333%')
    cy.get('.skill-section').should('have.css', 'grid-template-columns', 'repeat(3, 1fr)')
  })

  it('should handle touch interactions', () => {
    cy.viewport('iphone-x')

    // 测试滑动手势
    cy.get('.project-card')
      .first()
      .trigger('touchstart', { touches: [{ clientX: 0, clientY: 0 }] })
      .trigger('touchmove', { touches: [{ clientX: -100, clientY: 0 }] })
      .trigger('touchend')

    // 检查交互效果
    cy.get('.project-actions').should('be.visible')
  })
}) 