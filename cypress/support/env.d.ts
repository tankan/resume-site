/// <reference types="cypress" />

declare namespace Cypress {
  interface TestData {
    profile: {
      name: string
      title: string
      email: string
    }
    projects: Array<{
      id: number
      name: string
      description: string
    }>
  }

  interface ViewportConfig {
    width: number
    height: number
  }

  interface TimeoutConfig {
    defaultCommandTimeout: number
    requestTimeout: number
    pageLoadTimeout: number
  }

  interface TestUser {
    email: string
    password: string
  }

  interface EnvConfig extends Cypress.Config {
    apiUrl: string
    testUser: TestUser
    viewport: ViewportConfig
    timeouts: TimeoutConfig
    testData: TestData
  }

  interface Chainable {
    /**
     * 获取环境配置
     * @example cy.getEnvConfig()
     */
    getEnvConfig(): Chainable<EnvConfig>

    /**
     * 获取测试数据
     * @example cy.getTestData()
     */
    getTestData(): Chainable<TestData>

    /**
     * 获取测试用户
     * @example cy.getTestUser()
     */
    getTestUser(): Chainable<TestUser>

    /**
     * 获取超时配置
     * @example cy.getTimeouts()
     */
    getTimeouts(): Chainable<TimeoutConfig>

    /**
     * 获取视口配置
     * @example cy.getViewport()
     */
    getViewport(): Chainable<ViewportConfig>
  }
} 