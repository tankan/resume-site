describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should navigate through all main pages', () => {
    // 首页
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.contains('h1', '前端工程师简历').should('be.visible')

    // 关于我
    cy.contains('关于我').click()
    cy.url().should('include', '/about')
    cy.get('.about-card').should('be.visible')

    // 技能特长
    cy.contains('技能特长').click()
    cy.url().should('include', '/skills')
    cy.get('.skill-category').should('be.visible')

    // 项目经验
    cy.contains('项目经验').click()
    cy.url().should('include', '/projects')
    cy.get('.project-card').should('have.length.at.least', 1)
  })

  it('should toggle theme', () => {
    cy.get('[data-test="theme-switch"]').click()
    cy.get('html').should('have.class', 'dark')
    cy.get('[data-test="theme-switch"]').click()
    cy.get('html').should('not.have.class', 'dark')
  })

  it('should switch language', () => {
    cy.get('[data-test="language-switch"]').click()
    cy.contains('English').click()
    cy.contains('h1', 'Frontend Engineer Resume').should('be.visible')
  })
}) 