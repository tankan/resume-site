describe('Animations and Transitions', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should animate page transitions', () => {
    // 检查页面过渡动画
    cy.contains('关于我').click()
    cy.get('.fade-transform-enter-active').should('exist')
    cy.get('.fade-transform-leave-active').should('exist')
  })

  it('should animate theme switch', () => {
    // 检查主题切换动画
    cy.get('[data-test="theme-switch"]').click()
    cy.get('html')
      .should('have.class', 'dark')
      .and('have.css', 'transition')
  })

  it('should animate project cards', () => {
    cy.visit('/projects')
    
    // 检查卡片悬停动画
    cy.get('.project-card').first()
      .trigger('mouseenter')
      .should('have.css', 'transform', 'translateY(-5px)')
      .trigger('mouseleave')
      .should('have.css', 'transform', 'translateY(0px)')
  })

  it('should animate skeleton loading', () => {
    // 模拟加载状态
    cy.intercept('GET', '/api/resume', (req) => {
      req.delay(1000).reply({ data: {} })
    })

    cy.reload()
    cy.get('.skeleton-animation')
      .should('exist')
      .and('have.css', 'animation-name', 'skeleton-loading')
  })
}) 