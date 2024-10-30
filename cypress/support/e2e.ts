/// <reference types="cypress" />
import './commands'
import './env'
import './helpers'
import './test-utils'

// 全局配置
Cypress.config('viewportWidth', 1280)
Cypress.config('viewportHeight', 720)

// 全局钩子
beforeEach(() => {
  // 清除本地存储
  cy.clearLocalStorage()
  
  // 清除 IndexedDB
  cy.window().then((win) => {
    win.indexedDB.deleteDatabase('resume-db')
  })
  
  // 重置环境变量
  cy.task('resetEnv')
})

// 全局错误处理
Cypress.on('uncaught:exception', (err) => {
  // 返回 false 阻止 Cypress 失败
  console.error('Uncaught exception:', err)
  return false
})

// 自定义断言
chai.Assertion.addMethod('haveCssVar', function(variable: string) {
  const obj = this._obj
  const value = getComputedStyle(obj[0]).getPropertyValue(variable)
  this.assert(
    value !== '',
    `expected element to have CSS variable ${variable}`,
    `expected element to not have CSS variable ${variable}`,
    value
  )
})

// 性能监控
Cypress.on('window:before:load', (win) => {
  // 添加性能监控
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      cy.task('log', {
        type: 'performance',
        name: entry.name,
        duration: entry.duration,
        startTime: entry.startTime
      })
    })
  })
  
  observer.observe({ entryTypes: ['measure', 'paint'] })
}) 