import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
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

      // 注册文件预处理器
      on('file:preprocessor', async (file) => {
        // 这里可以添加文件预处理逻辑
        return file
      })

      // 修改配置
      config.env = {
        ...config.env,
        CI: process.env.CI === 'true'
      }

      return config
    }
  }
}) 