describe('PDF Export and Print', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should generate PDF with all sections', () => {
    // 模拟 PDF 生成 API
    cy.intercept('POST', '/api/generate-pdf', {
      statusCode: 200,
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': 'attachment; filename="resume.pdf"'
      },
      body: new Uint8Array([]) // 模拟 PDF 文件
    }).as('generatePDF')

    // 验证所有必要内容存在
    cy.get('.profile-section').should('exist')
    cy.get('.about-section').should('exist')
    cy.get('.skills-section').should('exist')
    cy.get('.projects-section').should('exist')

    // 点击生成按钮
    cy.get('[data-test="generate-pdf"]').click()
    cy.wait('@generatePDF')

    // 验证生成成功提示
    cy.contains('PDF 生成成功').should('be.visible')
  })

  it('should handle PDF generation errors gracefully', () => {
    // 模拟生成失败
    cy.intercept('POST', '/api/generate-pdf', {
      statusCode: 500,
      body: { message: 'PDF 生成失败' }
    }).as('generatePDFError')

    cy.get('[data-test="generate-pdf"]').click()
    cy.wait('@generatePDFError')
    cy.contains('PDF 生成失败').should('be.visible')
    cy.get('[data-test="retry-button"]').should('be.visible')
  })

  it('should apply print styles correctly', () => {
    // 检查打印样式
    cy.window().then((win) => {
      const styles = win.document.styleSheets
      const printStyles = Array.from(styles).filter(sheet => 
        Array.from(sheet.cssRules).some(rule => 
          rule.type === CSSRule.MEDIA_RULE && 
          rule.conditionText?.includes('print')
        )
      )

      // 验证打印样式规则
      expect(printStyles.length).to.be.greaterThan(0)

      // 验证具体的打印样式规则
      const rules = Array.from(printStyles[0].cssRules)
      const hideElements = rules.find(rule => 
        rule.selectorText?.includes('.nav-header, .nav-footer')
      )
      expect(hideElements).to.exist
    })
  })

  it('should handle large content printing', () => {
    // 添加大量内容
    cy.window().then((win) => {
      const content = document.createElement('div')
      content.className = 'test-content'
      content.style.height = '2000px'
      win.document.body.appendChild(content)
    })

    // 验证分页设置
    cy.get('.home-container').should('have.css', 'page-break-inside', 'avoid')
    cy.get('.about-container').should('have.css', 'page-break-inside', 'avoid')
    cy.get('h1, h2, h3').should('have.css', 'page-break-after', 'avoid')
  })
}) 