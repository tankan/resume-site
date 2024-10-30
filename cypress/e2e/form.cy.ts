describe('Form Handling', () => {
  beforeEach(() => {
    cy.visit('/contact')
  })

  it('should validate contact form', () => {
    // 测试空表单提交
    cy.get('[data-test="submit-button"]').click()
    cy.get('.el-form-item__error').should('be.visible')

    // 测试邮箱格式验证
    cy.get('[data-test="email-input"]').type('invalid-email')
    cy.get('[data-test="submit-button"]').click()
    cy.contains('请输入正确的邮箱地址').should('be.visible')

    // 测试成功提交
    cy.get('[data-test="name-input"]').type('测试用户')
    cy.get('[data-test="email-input"]').clear().type('test@example.com')
    cy.get('[data-test="message-input"]').type('这是一条测试消息')
    cy.get('[data-test="submit-button"]').click()
    cy.contains('提交成功').should('be.visible')
  })

  it('should handle form submission errors', () => {
    // 模拟网络错误
    cy.intercept('POST', '/api/contact', {
      statusCode: 500,
      body: { message: '服务器错误' }
    })

    cy.get('[data-test="name-input"]').type('测试用户')
    cy.get('[data-test="email-input"]').type('test@example.com')
    cy.get('[data-test="message-input"]').type('这是一条测试消息')
    cy.get('[data-test="submit-button"]').click()
    cy.contains('提交失败').should('be.visible')
  })
}) 