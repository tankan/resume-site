/// <reference types="cypress" />

// ==================== 基础命令 ====================

// 登录命令
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login')
    cy.get('[data-test="email-input"]').type(email)
    cy.get('[data-test="password-input"]').type(password)
    cy.get('[data-test="login-button"]').click()
    cy.url().should('not.include', '/login')
  })
})

// 导航命令
Cypress.Commands.add('navigateTo', (route: string) => {
  cy.get(`[data-test="nav-${route}"]`).click()
  cy.url().should('include', route)
  cy.get(`[data-test="${route}-container"]`).should('be.visible')
})

// ==================== UI 交互命令 ====================

// 主题命令
Cypress.Commands.add('toggleTheme', () => {
  cy.get('[data-test="theme-switch"]').click()
})

Cypress.Commands.add('setThemeColor', (color: string) => {
  cy.get('[data-test="theme-config-button"]').click()
  cy.get('[data-test="primary-color-picker"]')
    .click()
    .invoke('val', color)
    .trigger('change')
})

// 语言命令
Cypress.Commands.add('switchLanguage', (lang: 'zh-CN' | 'en-US') => {
  cy.get('[data-test="language-switch"]').click()
  cy.contains(lang === 'zh-CN' ? '中文' : 'English').click()
})

// 表单命令
Cypress.Commands.add('validateForm', (formSelector: string, data: Record<string, any>) => {
  cy.get(formSelector).within(() => {
    // 填写表单数据
    Object.entries(data).forEach(([field, value]) => {
      cy.get(`[data-test="${field}-input"]`).type(value.toString())
    })
    // 提交表单
    cy.get('[data-test="submit-button"]').click()
  })
})

// ==================== 性能监控命令 ====================

// 核心性能指标监控
Cypress.Commands.add('checkPerformanceMetrics', () => {
  return cy.window().then((win) => {
    const metrics = {
      fcp: 0,
      lcp: 0,
      cls: 0,
      fid: 0,
      ttfb: 0,
      tbt: 0
    }

    // 收集导航性能指标
    const navigation = win.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    metrics.ttfb = navigation.responseStart - navigation.requestStart

    // 收集绘制性能指标
    const paint = win.performance.getEntriesByType('paint')
    paint.forEach(entry => {
      if (entry.name === 'first-contentful-paint') {
        metrics.fcp = entry.startTime
      }
    })

    // 收集长任务
    const longTasks = win.performance.getEntriesByType('longtask')
    metrics.tbt = longTasks.reduce((total, task) => 
      total + (task.duration > 50 ? task.duration - 50 : 0), 0)

    return metrics
  })
})

// 资源加载监控
Cypress.Commands.add('checkResourceLoading', () => {
  return cy.window().then((win) => {
    const resources = win.performance.getEntriesByType('resource')
    return {
      total: resources.length,
      byType: resources.reduce((acc, resource: any) => {
        const type = resource.initiatorType
        if (!acc[type]) {
          acc[type] = { count: 0, size: 0, duration: 0 }
        }
        acc[type].count++
        acc[type].size += resource.encodedBodySize || 0
        acc[type].duration += resource.duration
        return acc
      }, {})
    }
  })
})

// ==================== 可访问性命令 ====================

// 可访问性检查
Cypress.Commands.add('checkA11y', (selector: string) => {
  cy.get(selector).then(($el) => {
    // 检查 ARIA 属性
    const ariaAttrs = ['aria-label', 'role', 'aria-describedby']
    ariaAttrs.forEach(attr => {
      if ($el.attr(attr)) {
        expect($el.attr(attr)).to.not.be.empty
      }
    })
    
    // 检查键盘可访问性
    cy.wrap($el)
      .should('have.attr', 'tabindex')
      .focus()
      .should('be.focused')
  })
})

// 响应式测试
Cypress.Commands.add('checkResponsive', (viewport: 'mobile' | 'tablet' | 'desktop') => {
  const viewports = {
    mobile: [375, 667],
    tablet: [768, 1024],
    desktop: [1920, 1080]
  }
  
  cy.viewport(...viewports[viewport])
  cy.wait(500) // 等待响应式布局调整
})

// ==================== 高级功能测试命令 ====================

// PWA 功能测试
Cypress.Commands.add('checkPWAFeatures', () => {
  cy.window().then((win) => {
    // 检查 Service Worker
    expect(win.navigator.serviceWorker.controller).to.exist
    
    // 检查 manifest
    cy.get('link[rel="manifest"]').should('exist')
    
    // 检查缓存
    win.caches.keys().then((cacheNames) => {
      expect(cacheNames).to.include('app-static')
    })
  })
})

// 离线功能测试
Cypress.Commands.add('testOfflineMode', () => {
  // 缓存必要资源
  cy.window().then((win) => {
    return win.caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/assets/main.js',
        '/assets/style.css'
      ])
    })
  })
  
  // 模拟离线
  cy.window().then((win) => {
    win.dispatchEvent(new Event('offline'))
  })
  
  // 验证离线功能
  cy.reload()
  cy.get('.offline-indicator').should('be.visible')
})

// 错误处理测试
Cypress.Commands.add('checkErrorHandling', (action: () => void, errorMessage: string) => {
  cy.on('uncaught:exception', (err) => {
    expect(err.message).to.include(errorMessage)
    return false
  })
  action()
  cy.contains(errorMessage).should('be.visible')
}) 