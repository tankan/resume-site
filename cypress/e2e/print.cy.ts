describe('Print Functionality', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should prepare page for printing', () => {
    // 检查打印样式是否正确加载
    cy.window().then((win) => {
      const styles = win.document.styleSheets
      const hasPrintStyles = Array.from(styles).some(sheet => 
        sheet.href?.includes('print.css') || 
        Array.from(sheet.cssRules).some(rule => 
          rule.type === CSSRule.MEDIA_RULE && 
          rule.conditionText?.includes('print')
        )
      )
      expect(hasPrintStyles).to.be.true
    })

    // 检查打印时隐藏的元素
    cy.get('.nav-header').should('have.css', 'display', 'none', { matchMedia: 'print' })
    cy.get('.nav-footer').should('have.css', 'display', 'none', { matchMedia: 'print' })

    // 检查打印时的内容格式
    cy.get('.home-container').should('have.css', 'page-break-inside', 'avoid', { matchMedia: 'print' })
    cy.get('.about-container').should('have.css', 'page-break-inside', 'avoid', { matchMedia: 'print' })
  })

  it('should handle PDF generation', () => {
    cy.intercept('GET', '/api/resume/download', {
      statusCode: 200,
      headers: {
        'content-type': 'application/pdf'
      },
      body: new Uint8Array([]) // 模拟 PDF 文件
    }).as('downloadPDF')

    cy.get('[data-test="download-button"]').click()
    cy.wait('@downloadPDF')
    cy.contains('下载成功').should('be.visible')
  })
}) 