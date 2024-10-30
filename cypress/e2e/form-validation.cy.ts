describe('Form Validation', () => {
  beforeEach(() => {
    cy.visit('/contact')
  })

  it('should validate required fields', () => {
    // 测试所有必填字段
    cy.get('[data-test="submit-button"]').click()
    cy.get('.el-form-item__error').should('have.length.at.least', 1)
    
    // 逐个填写字段并验证错误消息消失
    cy.get('[data-test="name-input"]').type('测试用户')
    cy.get('[data-test="name-input"]').parent().find('.el-form-item__error').should('not.exist')
  })

  it('should validate email format', () => {
    // 测试无效邮箱格式
    cy.get('[data-test="email-input"]').type('invalid-email')
    cy.get('[data-test="submit-button"]').click()
    cy.contains('请输入正确的邮箱地址').should('be.visible')

    // 测试有效邮箱格式
    cy.get('[data-test="email-input"]').clear().type('test@example.com')
    cy.contains('请输入正确的邮箱地址').should('not.exist')
  })

  it('should validate input length', () => {
    // 测试字段长度限制
    const longText = 'a'.repeat(1000)
    cy.get('[data-test="message-input"]').type(longText)
    cy.contains('字数超出限制').should('be.visible')

    // 清除并输入有效长度
    cy.get('[data-test="message-input"]').clear().type('这是一条测试消息')
    cy.contains('字数超出限制').should('not.exist')
  })

  it('should handle form submission', () => {
    // 填写有效数据
    cy.get('[data-test="name-input"]').type('测试用户')
    cy.get('[data-test="email-input"]').type('test@example.com')
    cy.get('[data-test="message-input"]').type('这是一条测试消息')

    // 模拟成功提交
    cy.intercept('POST', '/api/contact', {
      statusCode: 200,
      body: { message: '提交成功' }
    }).as('submitForm')

    cy.get('[data-test="submit-button"]').click()
    cy.wait('@submitForm')
    cy.contains('提交成功').should('be.visible')
  })
}) 