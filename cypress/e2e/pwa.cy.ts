describe('PWA Features', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should register service worker', () => {
    cy.window().then((win) => {
      expect(win.navigator.serviceWorker.controller).to.exist
    })
  })

  it('should handle offline mode', () => {
    // 首次访问缓存资源
    cy.visit('/')
    cy.contains('前端工程师简历').should('be.visible')

    // 模拟离线
    cy.window().then((win) => {
      win.dispatchEvent(new Event('offline'))
    })

    // 刷新页面，验证离线访问
    cy.reload()
    cy.contains('前端工程师简历').should('be.visible')
  })

  it('should show update notification', () => {
    cy.window().then((win) => {
      // 模拟 Service Worker 更新
      win.dispatchEvent(new CustomEvent('sw-update-available'))
    })

    // 验证更新提示
    cy.contains('新版本可用').should('be.visible')
    cy.contains('立即更新').click()
  })

  it('should cache static assets', () => {
    cy.window().then((win) => {
      win.caches.keys().then((cacheNames) => {
        expect(cacheNames).to.include('static-assets')
      })
    })
  })
}) 