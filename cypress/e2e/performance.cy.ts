describe('Performance', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load home page within 3 seconds', () => {
    cy.window().then((win) => {
      const performance = win.performance
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      expect(navigationEntry.duration).to.be.lessThan(3000)
    })
  })

  it('should have acceptable FCP', () => {
    cy.window().then((win) => {
      const fcpEntry = win.performance
        .getEntriesByType('paint')
        .find((entry) => entry.name === 'first-contentful-paint')
      expect(fcpEntry?.startTime).to.be.lessThan(2000)
    })
  })

  it('should have no layout shifts', () => {
    let totalCLS = 0
    cy.window().then((win) => {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            totalCLS += (entry as any).value
          }
        }
      }).observe({ entryTypes: ['layout-shift'] })

      // 等待页面完全加载
      cy.wait(3000).then(() => {
        expect(totalCLS).to.be.lessThan(0.1)
      })
    })
  })
}) 