describe('SEO and Metadata', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should have all required meta tags', () => {
    cy.document().then((doc) => {
      // 基础 meta 标签
      const description = doc.querySelector('meta[name="description"]')
      const keywords = doc.querySelector('meta[name="keywords"]')
      const viewport = doc.querySelector('meta[name="viewport"]')
      
      expect(description).to.exist
      expect(keywords).to.exist
      expect(viewport).to.exist
      
      // Open Graph 标签
      const ogTitle = doc.querySelector('meta[property="og:title"]')
      const ogDescription = doc.querySelector('meta[property="og:description"]')
      const ogType = doc.querySelector('meta[property="og:type"]')
      const ogUrl = doc.querySelector('meta[property="og:url"]')
      
      expect(ogTitle).to.exist
      expect(ogDescription).to.exist
      expect(ogType).to.exist
      expect(ogUrl).to.exist
      
      // Twitter 卡片标签
      const twitterCard = doc.querySelector('meta[name="twitter:card"]')
      const twitterTitle = doc.querySelector('meta[name="twitter:title"]')
      const twitterDescription = doc.querySelector('meta[name="twitter:description"]')
      
      expect(twitterCard).to.exist
      expect(twitterTitle).to.exist
      expect(twitterDescription).to.exist
    })
  })

  it('should update meta tags on route change', () => {
    // 首页
    cy.title().should('include', '前端工程师简历')
    cy.get('meta[name="description"]')
      .should('have.attr', 'content')
      .and('include', '前端开发')

    // 关于页面
    cy.contains('关于我').click()
    cy.title().should('include', '关于我')
    cy.get('meta[name="description"]')
      .should('have.attr', 'content')
      .and('include', '个人介绍')

    // 项目页面
    cy.contains('项目经验').click()
    cy.title().should('include', '项目经验')
    cy.get('meta[name="description"]')
      .should('have.attr', 'content')
      .and('include', '项目')
  })

  it('should have valid structured data', () => {
    cy.get('script[type="application/ld+json"]').should((scripts) => {
      const jsonLd = JSON.parse(scripts[0].textContent || '')
      
      // Person 类型
      expect(jsonLd['@type']).to.equal('Person')
      expect(jsonLd.name).to.not.be.empty
      expect(jsonLd.jobTitle).to.not.be.empty
      expect(jsonLd.email).to.not.be.empty
      
      // 工作经验
      expect(jsonLd.hasOccupation).to.be.an('array')
      expect(jsonLd.hasOccupation[0]).to.have.property('name')
      expect(jsonLd.hasOccupation[0]).to.have.property('startDate')
      
      // 技能
      expect(jsonLd.hasSkill).to.be.an('array')
      expect(jsonLd.hasSkill[0]).to.have.property('name')
    })
  })
}) 