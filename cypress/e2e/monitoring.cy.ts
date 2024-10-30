describe('Performance Monitoring', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        // 模拟 PerformanceObserver
        cy.stub(win, 'PerformanceObserver').callsFake((callback) => ({
          observe: () => {
            callback({
              getEntries: () => [{
                name: 'first-contentful-paint',
                startTime: 800,
                entryType: 'paint'
              }]
            })
          },
          disconnect: () => {}
        }))
      }
    })
  })

  it('should collect performance metrics', () => {
    cy.intercept('POST', '/api/monitor', {
      statusCode: 200
    }).as('reportMetrics')

    // 等待性能指标收集和上报
    cy.wait('@reportMetrics').then((interception) => {
      const metrics = interception.request.body
      expect(metrics).to.have.property('fcp')
      expect(metrics).to.have.property('ttfb')
      expect(metrics.fcp).to.be.a('number')
      expect(metrics.ttfb).to.be.a('number')
    })
  })

  it('should handle monitoring errors gracefully', () => {
    cy.intercept('POST', '/api/monitor', {
      statusCode: 500
    }).as('reportMetricsError')

    // 确保错误不会影响用户体验
    cy.wait('@reportMetricsError')
    cy.get('.home-container').should('be.visible')
  })
}) 