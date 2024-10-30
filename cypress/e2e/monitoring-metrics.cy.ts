describe('Performance Monitoring', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/monitor', {
      statusCode: 200
    }).as('reportMetrics')
  })

  it('should collect and report core web vitals', () => {
    cy.visit('/')
    
    // 等待性能指标收集和上报
    cy.wait('@reportMetrics').then((interception) => {
      const metrics = interception.request.body
      
      // 验证关键指标存在
      expect(metrics).to.have.property('fcp')
      expect(metrics).to.have.property('lcp')
      expect(metrics).to.have.property('fid')
      expect(metrics).to.have.property('cls')
      expect(metrics).to.have.property('ttfb')
      
      // 验证指标值合理
      expect(metrics.fcp).to.be.lessThan(2000)
      expect(metrics.lcp).to.be.lessThan(2500)
      expect(metrics.fid).to.be.lessThan(100)
      expect(metrics.cls).to.be.lessThan(0.1)
    })
  })

  it('should handle monitoring service errors', () => {
    cy.intercept('POST', '/api/monitor', {
      statusCode: 500
    }).as('reportMetricsError')

    cy.visit('/')
    
    // 验证错误不影响用户体验
    cy.wait('@reportMetricsError')
    cy.get('.home-container').should('be.visible')
  })

  it('should batch metrics reports', () => {
    let reportCount = 0
    cy.intercept('POST', '/api/monitor', (req) => {
      reportCount++
      req.reply(200)
    }).as('batchReport')

    cy.visit('/')
    cy.wait(5000) // 等待批量上报时间间隔
    
    // 验证批量上报次数合理
    expect(reportCount).to.be.lessThan(3)
  })
}) 