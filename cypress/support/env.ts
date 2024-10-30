// 环境变量配置
Cypress.env({
  // API 配置
  apiUrl: 'http://localhost:3000',
  
  // 测试账号
  testUser: {
    email: 'test@example.com',
    password: 'password123'
  },
  
  // 视口配置
  viewport: {
    width: 1280,
    height: 720
  },
  
  // 超时配置
  timeouts: {
    defaultCommandTimeout: 4000,
    requestTimeout: 5000,
    pageLoadTimeout: 30000
  },
  
  // 测试数据
  testData: {
    profile: {
      name: '测试用户',
      title: '前端工程师',
      email: 'test@example.com'
    },
    projects: [
      {
        id: 1,
        name: '测试项目',
        description: '这是一个测试项目'
      }
    ]
  }
}) 