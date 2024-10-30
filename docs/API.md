# API 文档

## 接口规范

### 基础 URL
- 开发环境: `http://localhost:3000`
- 生产环境: `https://api.example.com`

### 请求格式
- Content-Type: `application/json`
- 请求方法: GET, POST, PUT, DELETE
- 认证: Bearer Token

### 响应格式
```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

## 接口列表

### 简历相关

#### 获取简历信息
```
GET /api/resume
```

响应：
```json
{
  "code": 0,
  "data": {
    "profile": {
      "name": "张三",
      "title": "高级前端工程师",
      "email": "example@email.com"
    }
  }
}
```

#### 下载简历
```
GET /api/resume/download
```

### 性能监控

#### 上报性能指标
```
POST /api/monitor
Content-Type: application/json

{
  "fcp": 1000,
  "lcp": 2000,
  "fid": 100,
  "cls": 0.1,
  "ttfb": 200
}
```

#### 上报错误信息
```
POST /api/error
Content-Type: application/json

{
  "type": "runtime",
  "message": "Error message",
  "stack": "Error stack trace"
}
```

## 错误码

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 1001 | 参数错误 |
| 1002 | 认证失败 |
| 2001 | 服务器错误 |
| 2002 | 资源不存在 |

## 开发指南

### 添加新接口
1. 定义接口规范
2. 实现接口逻辑
3. 添加接口文档
4. 编写测试用例

### 修改接口
1. 确保向后兼容
2. 更新文档
3. 更新测试
4. 添加更新日志 