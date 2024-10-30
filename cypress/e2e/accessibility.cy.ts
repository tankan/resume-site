describe('Accessibility', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.injectAxe() // 需要安装并配置 cypress-axe
  })

  it('should have no accessibility violations on home page', () => {
    cy.checkA11y()
  })

  it('should have proper heading structure', () => {
    // 检查标题层级
    cy.get('h1').should('have.length', 1)
    cy.get('h1').should('be.visible')
    
    cy.get('h2').each(($h2) => {
      // 确保 h2 在 h1 之后
      cy.wrap($h2)
        .invoke('offset')
        .its('top')
        .should('be.gt', 
          Cypress.$('h1').offset().top
        )
    })
  })

  it('should have proper ARIA labels', () => {
    // 检查导航
    cy.get('nav').should('have.attr', 'aria-label')
    
    // 检查按钮
    cy.get('button').each(($button) => {
      cy.wrap($button).should(($el) => {
        expect(
          $el.attr('aria-label') || $el.text().trim()
        ).to.not.be.empty
      })
    })
    
    // 检查图片
    cy.get('img').should('have.attr', 'alt')
  })

  it('should be keyboard navigable', () => {
    // 测试键盘导航
    cy.get('body').tab()
    cy.focused().should('have.attr', 'href', '/about')
    
    cy.get('body').tab()
    cy.focused().should('have.attr', 'href', '/skills')
    
    cy.get('body').tab()
    cy.focused().should('have.attr', 'href', '/projects')
  })

  it('should have sufficient color contrast', () => {
    // 检查颜色对比度
    cy.get('p').each(($p) => {
      const color = $p.css('color')
      const backgroundColor = $p.css('background-color')
      // 使用 color-contrast 工具检查对比度
      expect(getContrastRatio(color, backgroundColor)).to.be.at.least(4.5)
    })
  })
}) 