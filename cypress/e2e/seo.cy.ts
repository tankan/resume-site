describe('SEO', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should have correct meta tags', () => {
    cy.document().then((doc) => {
      // 检查标题
      expect(doc.title).to.include('前端工程师简历')

      // 检查 meta 描述
      const description = doc.querySelector('meta[name="description"]')
      expect(description).to.exist
      expect(description?.getAttribute('content')).to.not.be.empty

      // 检查 meta 关键词
      const keywords = doc.querySelector('meta[name="keywords"]')
      expect(keywords).to.exist
      expect(keywords?.getAttribute('content')).to.not.be.empty
    })
  })

  it('should have Open Graph tags', () => {
    cy.document().then((doc) => {
      const ogTitle = doc.querySelector('meta[property="og:title"]')
      const ogDescription = doc.querySelector('meta[property="og:description"]')
      const ogType = doc.querySelector('meta[property="og:type"]')
      const ogUrl = doc.querySelector('meta[property="og:url"]')

      expect(ogTitle).to.exist
      expect(ogDescription).to.exist
      expect(ogType).to.exist
      expect(ogUrl).to.exist
    })
  })

  it('should update meta tags on route change', () => {
    // 检查首页标题
    cy.title().should('include', '前端工程师简历')

    // 导航到关于页面
    cy.contains('关于我').click()
    cy.title().should('include', '关于我')

    // 导航到技能页面
    cy.contains('技能特长').click()
    cy.title().should('include', '技能特长')
  })
}) 