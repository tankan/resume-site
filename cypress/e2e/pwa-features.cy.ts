describe('PWA Features', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should install and register service worker', () => {
    cy.window().then((win) => {
      // 检查 Service Worker 注册
      expect(win.navigator.serviceWorker.controller).to.exist

      // 检查 manifest
      const manifestLink = win.document.querySelector('link[rel="manifest"]')
      expect(manifestLink).to.exist
    })
  })

  it('should handle app installation', () => {
    cy.window().then((win) => {
      // 模拟 beforeinstallprompt 事件
      const beforeInstallPromptEvent = new Event('beforeinstallprompt')
      win.dispatchEvent(beforeInstallPromptEvent)

      // 检查安装提示是否显示
      cy.get('[data-test="pwa-install-prompt"]').should('be.visible')
      cy.contains('添加到主屏幕').should('be.visible')
    })
  })

  it('should handle offline/online transitions', () => {
    // 模拟离线状态
    cy.window().then((win) => {
      win.dispatchEvent(new Event('offline'))
    })
    cy.contains('当前处于离线模式').should('be.visible')

    // 检查离线缓存
    cy.get('img').should('be.visible')
    cy.get('.nav-header').should('be.visible')

    // 恢复在线状态
    cy.window().then((win) => {
      win.dispatchEvent(new Event('online'))
    })
    cy.contains('网络已恢复').should('be.visible')
  })

  it('should handle app updates', () => {
    cy.window().then((win) => {
      // 模拟 Service Worker 更新
      win.dispatchEvent(new CustomEvent('sw-update-available'))
    })

    // 检查更新提示
    cy.contains('新版本可用').should('be.visible')
    cy.get('[data-test="update-button"]').should('be.visible')

    // 点击更新按钮
    cy.get('[data-test="update-button"]').click()
    cy.contains('更新中...').should('be.visible')
  })

  it('should cache static assets', () => {
    // 首次访问
    cy.visit('/')
    cy.get('img').should('be.visible')

    // 检查缓存
    cy.window().then((win) => {
      win.caches.keys().then((cacheNames) => {
        expect(cacheNames).to.include('static-assets')
        expect(cacheNames).to.include('images')
      })
    })

    // 模拟离线并验证缓存资源可用
    cy.window().then((win) => {
      win.dispatchEvent(new Event('offline'))
    })
    cy.reload()
    cy.get('img').should('be.visible')
  })
}) 