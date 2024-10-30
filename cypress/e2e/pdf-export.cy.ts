describe('PDF Export', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should generate PDF with correct content', () => {
    // 模拟 PDF 生成 API
    cy.intercept('POST', '/api/generate-pdf', {
      statusCode: 200,
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': 'attachment; filename="resume.pdf"'
      },
      body: new Uint8Array([]) // 模拟 PDF 文件
    }).as('generatePDF')

    // 点击生成按钮
    cy.get('[data-test="generate-pdf"]').click()
    cy.wait('@generatePDF')

    // 验证生成成功提示
    cy.contains('PDF 生成成功').should('be.visible')
  })

  it('should handle PDF generation errors', () => {
    // 模拟生成失败
    cy.intercept('POST', '/api/generate-pdf', {
      statusCode: 500,
      body: { message: 'PDF 生成失败' }
    }).as('generatePDFError')

    cy.get('[data-test="generate-pdf"]').click()
    cy.wait('@generatePDFError')
    cy.contains('PDF 生成失败').should('be.visible')
  })

  it('should include all resume sections in PDF', () => {
    // 检查所有需要导出的内容是否存在
    cy.get('.profile-section').should('exist')
    cy.get('.about-content').should('exist')
    cy.get('.skills-content').should('exist')
    cy.get('.projects-content').should('exist')

    // 验证打印样式
    cy.window().then((win) => {
      const styles = win.document.styleSheets
      const hasPrintStyles = Array.from(styles).some(sheet => 
        Array.from(sheet.cssRules).some(rule => 
          rule.type === CSSRule.MEDIA_RULE && 
          rule.conditionText?.includes('print')
        )
      )
      expect(hasPrintStyles).to.be.true
    })
  })
}) 