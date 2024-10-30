describe('Responsive Layout', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should adapt to mobile viewport', () => {
    cy.viewport('iphone-x')
    
    // 导航菜单应该隐藏
    cy.get('.nav-menu').should('not.be.visible')
    
    // 操作按钮应该适应移动端布局
    cy.get('.actions').should('have.css', 'gap', '8px')
    
    // 内容应该单列显示
    cy.get('.project-card').should('have.css', 'width', '100%')
  })

  it('should adapt to tablet viewport', () => {
    cy.viewport('ipad-2')
    
    // 导航菜单应该显示
    cy.get('.nav-menu').should('be.visible')
    
    // 项目卡片应该两列显示
    cy.get('.projects-container .el-col').should('have.class', 'el-col-12')
  })

  it('should adapt to desktop viewport', () => {
    cy.viewport(1920, 1080)
    
    // 导航菜单应该显示
    cy.get('.nav-menu').should('be.visible')
    
    // 项目卡片应该三列显示
    cy.get('.projects-container .el-col').should('have.class', 'el-col-8')
  })
}) 