describe('Performance Monitoring', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/monitor', {
      statusCode: 200
    }).as('reportMetrics')

    cy.intercept('POST', '/api/error', {
      statusCode: 200
    }).as('reportError')
  })

  it('should collect and report all core web vitals', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        // 模拟性能指标
        cy.stub(win.performance, 'getEntriesByType').returns([{
          name: 'first-contentful-paint',
          startTime: 800,
          entryType: 'paint'
        }])

        // 模拟 PerformanceObserver
        cy.stub(win, 'PerformanceObserver').callsFake((callback) => ({
          observe: () => {
            callback({
              getEntries: () => [{
                name: 'largest-contentful-paint',
                startTime: 1200,
                entryType: 'largest-contentful-paint'
              }]
            })
          },
          disconnect: () => {}
        }))
      }
    })

    // 等待性能指标上报
    cy.wait('@reportMetrics').then((interception) => {
      const metrics = interception.request.body
      
      // 验证所有必要的性能指标
      expect(metrics).to.have.property('fcp')
      expect(metrics).to.have.property('lcp')
      expect(metrics).to.have.property('fid')
      expect(metrics).to.have.property('cls')
      expect(metrics).to.have.property('ttfb')
      
      // 验证指标值的合理性
      expect(metrics.fcp).to.be.lessThan(2000)
      expect(metrics.lcp).to.be.lessThan(2500)
      expect(metrics.fid).to.be.lessThan(100)
      expect(metrics.cls).to.be.lessThan(0.1)
      expect(metrics.ttfb).to.be.lessThan(600)
    })
  })

  it('should batch performance metrics reports', () => {
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

  it('should handle monitoring service errors gracefully', () => {
    cy.intercept('POST', '/api/monitor', {
      statusCode: 500,
      times: 3 // 连续失败3次
    }).as('reportError')

    cy.visit('/')
    
    // 验证错误不影响用户体验
    cy.get('.home-container').should('be.visible')
    cy.contains('前端工程师简历').should('be.visible')
  })

  it('should monitor user interactions', () => {
    cy.visit('/')
    
    // 记录用户交互
    cy.get('[data-test="theme-switch"]').click()
    cy.get('[data-test="language-switch"]').click()
    
    // 验证交互指标上报
    cy.wait('@reportMetrics').then((interception) => {
      const metrics = interception.request.body
      expect(metrics).to.have.property('interactions')
      expect(metrics.interactions).to.have.length.at.least(2)
    })
  })
}) 