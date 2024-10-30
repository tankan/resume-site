describe('Offline Functionality', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should work offline with cached resources', () => {
    // 首次访问缓存资源
    cy.visit('/')
    cy.contains('前端工程师简历').should('be.visible')

    // 模拟离线
    cy.window().then((win) => {
      win.dispatchEvent(new Event('offline'))
    })

    // 检查离线提示
    cy.contains('当前处于离线模式').should('be.visible')

    // 验证缓存资源是否可用
    cy.reload()
    cy.contains('前端工程师简历').should('be.visible')
    cy.get('img').should('be.visible')
  })

  it('should handle offline form submission', () => {
    // 模拟离线状态
    cy.window().then((win) => {
      win.dispatchEvent(new Event('offline'))
    })

    // 填写表单
    cy.get('[data-test="contact-form"]').within(() => {
      cy.get('[data-test="name-input"]').type('测试用户')
      cy.get('[data-test="email-input"]').type('test@example.com')
      cy.get('[data-test="message-input"]').type('这是一条测试消息')
      cy.get('[data-test="submit-button"]').click()
    })

    // 检查离线队列提示
    cy.contains('表单将在恢复网络连接后提交').should('be.visible')

    // 恢复在线状态
    cy.window().then((win) => {
      win.dispatchEvent(new Event('online'))
    })

    // 验证表单是否自动提交
    cy.contains('表单提交成功').should('be.visible')
  })

  it('should sync data when back online', () => {
    // 模拟离线操作
    cy.window().then((win) => {
      win.dispatchEvent(new Event('offline'))
      localStorage.setItem('offlineActions', JSON.stringify([
        { type: 'form', data: { name: '测试用户', email: 'test@example.com' } }
      ]))
    })

    // 恢复在线状态
    cy.window().then((win) => {
      win.dispatchEvent(new Event('online'))
    })

    // 验证数据同步
    cy.contains('数据同步完成').should('be.visible')
  })
}) 