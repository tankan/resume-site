describe('Print and Download', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should handle resume download', () => {
    // 模拟 PDF 下载
    cy.intercept('GET', '/api/resume/download', {
      statusCode: 200,
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': 'attachment; filename="resume.pdf"'
      },
      body: new Uint8Array([]) // 模拟 PDF 文件
    }).as('downloadResume')

    cy.get('[data-test="download-button"]').click()
    cy.wait('@downloadResume')
    cy.contains('下载成功').should('be.visible')
  })

  it('should handle download errors', () => {
    // 模拟下载失败
    cy.intercept('GET', '/api/resume/download', {
      statusCode: 500,
      body: { message: '下载失败' }
    }).as('downloadError')

    cy.get('[data-test="download-button"]').click()
    cy.wait('@downloadError')
    cy.contains('下载失败').should('be.visible')
  })

  it('should apply print styles', () => {
    // 检查打印样式
    cy.window().then((win) => {
      const printStyles = win.document.styleSheets
      const hasPrintStyles = Array.from(printStyles).some(sheet => 
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
  })
}) 