describe('SEO and Metadata', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should update meta tags on route change', () => {
    // 检查首页元数据
    cy.title().should('include', '前端工程师简历')
    cy.get('meta[name="description"]')
      .should('have.attr', 'content')
      .and('not.be.empty')

    // 导航到关于页面
    cy.contains('关于我').click()
    cy.title().should('include', '关于我')
    cy.get('meta[name="description"]')
      .should('have.attr', 'content')
      .and('include', '关于')
  })

  it('should have valid Open Graph tags', () => {
    cy.get('meta[property="og:title"]').should('exist')
    cy.get('meta[property="og:description"]').should('exist')
    cy.get('meta[property="og:type"]').should('exist')
    cy.get('meta[property="og:url"]').should('exist')
  })

  it('should have valid structured data', () => {
    cy.get('script[type="application/ld+json"]').should((scripts) => {
      const jsonLd = JSON.parse(scripts[0].textContent || '')
      expect(jsonLd['@type']).to.equal('Person')
      expect(jsonLd.name).to.not.be.empty
      expect(jsonLd.jobTitle).to.not.be.empty
    })
  })

  it('should have canonical URL', () => {
    cy.get('link[rel="canonical"]')
      .should('have.attr', 'href')
      .and('include', window.location.origin)
  })
}) 