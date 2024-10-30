# 部署文档

## 环境要求

### 开发环境
- Node.js >= 16
- npm >= 8
- Git

### 生产环境
- Nginx >= 1.20
- HTTPS 证书
- 域名解析

## 构建配置

### 环境变量
```bash
# 生产环境
VITE_MONITOR_API=https://api.example.com/monitor
VITE_ERROR_API=https://api.example.com/error
VITE_LOG_API=https://api.example.com/logs
VITE_API_BASE_URL=https://api.example.com
VITE_APP_TITLE=前端工程师简历
```

### 构建命令
```bash
# 安装依赖
npm install

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 部署流程

### GitHub Pages
1. 配置 GitHub Actions
2. 推送到 main 分支
3. 自动构建部署
4. 访问站点

### 自定义服务器
1. 构建项目
2. 配置 Nginx
3. 上传文件
4. 重启服务

## Nginx 配置

### 基础配置
```nginx
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /path/to/dist;
    index index.html;

    # 处理 history 模式路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
```

## CI/CD 配置

### GitHub Actions
```yaml
name: Deploy
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 监控配置

### 性能监控
- 配置监控 API
- 设置告警阈值
- 收集性能指标
- 分析优化建议

### 错误监控
- 配置错误上报
- 设置错误告警
- 收集错误日志
- 分析错误原因 