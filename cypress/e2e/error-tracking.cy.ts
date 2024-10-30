describe('Error Tracking', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/error', {
      statusCode: 200
    }).as('reportError')
  })

  it('should track and report runtime errors', () => {
    // 注入一个会抛出错误的脚本
    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'error').as('consoleError')
        win.addEventListener('load', () => {
          throw new Error('Test runtime error')
        })
      }
    })

    cy.wait('@reportError').then((interception) => {
      const errorReport = interception.request.body
      expect(errorReport.type).to.equal('runtime')
      expect(errorReport.message).to.include('Test runtime error')
      expect(errorReport.stack).to.exist
    })
  })

  it('should track and report network errors', () => {
    // 模拟 API 请求失败
    cy.intercept('GET', '/api/data', {
      forceNetworkError: true
    }).as('failedRequest')

    cy.visit('/')
    cy.wait('@reportError').then((interception) => {
      const errorReport = interception.request.body
      expect(errorReport.type).to.equal('network')
    })
  })

  it('should handle error reporting service failures', () => {
    cy.intercept('POST', '/api/error', {
      statusCode: 500
    }).as('reportErrorFailure')

    // 注入错误
    cy.visit('/', {
      onBeforeLoad(win) {
        win.addEventListener('load', () => {
          throw new Error('Test error')
        })
      }
    })

    // 验证错误上报失败不影响用户体验
    cy.wait('@reportErrorFailure')
    cy.get('.home-container').should('be.visible')
  })
}) 