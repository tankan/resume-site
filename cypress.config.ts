import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: false,
    screenshotOnRunFailure: false,
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      // 注册任务
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
        table(message) {
          console.table(message)
          return null
        }
      })

      // 修改配置
      config.env = {
        ...config.env,
        CI: process.env.CI === 'true'
      }

      return config
    }
  },
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite'
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts'
  },
  env: {
    apiUrl: 'http://localhost:3000',
    coverage: true
  },
  retries: {
    runMode: 2,
    openMode: 0
  },
  defaultCommandTimeout: 4000,
  requestTimeout: 5000,
  responseTimeout: 30000,
  pageLoadTimeout: 60000,
  watchForFileChanges: true,
  chromeWebSecurity: false,
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: true
  }
}) 