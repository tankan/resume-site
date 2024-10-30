describe('Error Handling', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should handle API errors gracefully', () => {
    // 模拟 API 错误
    cy.intercept('GET', '/api/resume', {
      statusCode: 500,
      body: { message: '服务器错误' }
    }).as('getResume')

    cy.reload()
    cy.contains('服务器错误').should('be.visible')
    cy.get('[data-test="retry-button"]').should('be.visible')
  })

  it('should handle network errors', () => {
    // 模拟网络错误
    cy.intercept('GET', '/api/resume', {
      forceNetworkError: true
    }).as('getResumeNetworkError')

    cy.reload()
    cy.contains('网络连接失败').should('be.visible')
  })

  it('should handle component errors', () => {
    // 访问不存在的路由
    cy.visit('/not-found')
    cy.contains('页面不存在').should('be.visible')
    cy.get('[data-test="back-button"]').should('be.visible')

    // 点击返回按钮
    cy.get('[data-test="back-button"]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('should retry failed requests', () => {
    let attempts = 0
    cy.intercept('GET', '/api/resume', (req) => {
      attempts++
      if (attempts < 2) {
        req.reply({ statusCode: 500 })
      } else {
        req.reply({ statusCode: 200, body: { data: {} } })
      }
    }).as('retryRequest')

    cy.reload()
    cy.get('[data-test="retry-button"]').click()
    cy.wait('@retryRequest')
    cy.wait('@retryRequest')
    cy.contains('服务器错误').should('not.exist')
  })
}) 