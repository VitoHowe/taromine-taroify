# Taro HTTP 服务使用指南

本项目已完全切换到基于 `Taro.request` 的 HTTP 服务，彻底解决了 axios 在微信小程序环境中的兼容性问题。

## 🚀 为什么选择 Taro.request？

### ❌ Axios 在 Taro 中的问题
- **Cookies 兼容性**：微信小程序不支持 `document.cookie`，导致 `Cannot read property 'match' of undefined` 错误
- **适配器复杂性**：需要复杂的适配器来处理不同平台的差异
- **体积增加**：引入了不必要的浏览器 API 依赖
- **维护成本**：需要处理各种环境兼容性问题

### ✅ Taro.request 的优势
- **原生支持**：Taro 官方提供，完美支持所有平台
- **零配置**：无需复杂的适配器和环境判断
- **轻量级**：只包含必要的网络请求功能
- **统一 API**：在所有平台上提供一致的请求体验

## 📖 API 文档

### 基本使用

```typescript
import { http, api } from '~/services'

// 基本请求
const response = await http.get('/users')
const response = await http.post('/users', userData)
const response = await http.put('/users/1', userData)
const response = await http.delete('/users/1')
const response = await http.patch('/users/1', partialData)
```

### 请求配置

```typescript
// 完整配置选项
await http.get('/api/data', {
  showLoading: true,           // 是否显示加载提示
  loadingText: '数据加载中...', // 加载提示文字
  showError: true,             // 是否显示错误提示
  timeout: 15000,              // 请求超时时间
  headers: {                   // 自定义请求头
    'Custom-Header': 'value'
  },
  params: {                    // GET 请求参数
    page: 1,
    limit: 10
  }
})
```

### 文件上传

```typescript
// 上传单个文件
const result = await http.upload('/upload', filePath, 'avatar')

// 上传文件并附加表单数据
const result = await http.upload('/upload', filePath, 'file', {
  userId: '123',
  category: 'profile'
}, {
  showLoading: true,
  loadingText: '上传中...'
})
```

### 文件下载

```typescript
// 下载文件
const result = await http.download('/files/document.pdf', {
  showLoading: true,
  loadingText: '下载中...'
})

console.log('下载完成，临时文件路径:', result.tempFilePath)
```

## 🎯 API 服务使用

### 认证 API

```typescript
import api from '~/services/api'

// 微信小程序登录
const loginResult = await api.auth.login(code, 'weapp')

// 检查登录状态
const isValid = await api.auth.checkSession()

// 登出
await api.auth.logout()
```

### 用户 API

```typescript
// 获取用户信息
const userInfo = await api.user.getUserInfo()

// 更新用户信息
await api.user.updateUserInfo(newUserInfo)

// 更新用户资料（微信授权信息）
await api.user.updateUserProfile(userProfile)
```

### 学习 API

```typescript
// 获取推荐学习内容
const studyItems = await api.study.getRecommendedStudy(10)

// 获取学习进度
const progress = await api.study.getStudyProgress('user123')

// 更新学习进度
await api.study.updateStudyProgress('study456', 75)

// 获取轮播图
const banners = await api.study.getBanners()
```

### 知识点 API

```typescript
// 获取知识点列表
const knowledge = await api.knowledge.getKnowledgePoints()

// 按分类筛选
const jsKnowledge = await api.knowledge.getKnowledgePoints('javascript')

// 搜索知识点
const searchResults = await api.knowledge.searchKnowledge('react hooks')
```

### 练习 API

```typescript
// 获取练习列表
const practices = await api.practice.getPracticeList()

// 提交练习答案
await api.practice.submitPractice('practice123', answers)

// 获取练习结果
const result = await api.practice.getPracticeResult('practice123')
```

## 🔧 自定义 Hook

### 现有 Hook

```typescript
import { 
  useFetchTabList, 
  useFetchNewGoodsList, 
  useFetchRecommendedStudy,
  useFetchBanners 
} from '~/schema/home'

function Component() {
  // 获取分类标签
  const { data: categories, loading, error } = useFetchTabList()
  
  // 获取新商品列表
  const { data: goods, loading: goodsLoading } = useFetchNewGoodsList(10, 0)
  
  // 获取推荐学习内容
  const { data: studyItems } = useFetchRecommendedStudy(5)
  
  // 获取轮播图
  const { data: banners } = useFetchBanners()
  
  if (loading) return <Loading />
  if (error) return <Error message={error} />
  
  return <div>{/* 渲染数据 */}</div>
}
```

### 创建自定义 Hook

```typescript
import { useState, useEffect } from 'react'
import api from '~/services/api'

export function useCustomData(params: any) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await api.custom.getData(params)
        setData(response.data)
        setError(null)
      } catch (err: any) {
        setError(err.message || '请求失败')
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params])

  return { data, loading, error }
}
```

## 🛡️ 错误处理

### 自动错误处理

系统会自动处理以下错误：

- **401 未授权**：自动清除登录信息，提示重新登录
- **403 禁止访问**：显示权限不足提示
- **404 资源不存在**：显示资源不存在提示
- **网络错误**：显示网络连接失败提示
- **超时错误**：显示请求超时提示

### 自定义错误处理

```typescript
try {
  const data = await api.user.getUserInfo()
  // 处理成功响应
} catch (error) {
  // 自定义错误处理
  console.error('获取用户信息失败:', error)
  
  if (error.code === 404) {
    // 用户不存在的特殊处理
  }
}
```

### 禁用自动错误提示

```typescript
// 禁用自动错误提示，自行处理错误
await http.get('/api/data', { showError: false })
```

## 🔄 请求拦截

### 自动添加的功能

- **认证头**：自动添加 `Authorization` 或 `X-OpenId` 头
- **Content-Type**：自动设置为 `application/json`
- **加载提示**：自动显示/隐藏加载提示
- **错误处理**：统一的错误处理和用户提示

### 请求日志

开发环境下会自动打印详细的请求日志：

```
📤 [TaroHTTP] 发送请求: {
  method: "POST",
  url: "/api/auth/login",
  headers: { "content-type": "application/json" },
  data: { code: "xxx", appType: "weapp" }
}

📥 [TaroHTTP] 收到响应: {
  statusCode: 200,
  data: { code: 200, message: "success", data: {...} }
}
```

## 🌍 跨平台支持

### 支持的平台

- ✅ **微信小程序**：完美支持
- ✅ **支付宝小程序**：完美支持
- ✅ **字节跳动小程序**：完美支持
- ✅ **H5 浏览器**：完美支持
- ✅ **React Native**：完美支持
- ✅ **其他小程序平台**：完美支持

### 平台特性

所有平台都支持相同的 API，无需额外的适配代码：

```typescript
// 这段代码在所有平台上都能正常工作
const response = await http.post('/api/login', {
  username: 'user',
  password: 'pass'
})
```

## ⚡ 性能优化

### 自动优化

- **请求合并**：相同请求会被自动合并
- **错误缓存**：避免重复的错误提示
- **内存管理**：自动清理请求相关的内存
- **加载状态**：智能的加载状态管理

### 手动优化

```typescript
// 禁用加载提示以提高性能
await http.get('/api/data', { showLoading: false })

// 设置更短的超时时间
await http.get('/api/data', { timeout: 5000 })

// 批量请求
const [users, posts, comments] = await Promise.all([
  api.user.getUsers(),
  api.post.getPosts(),
  api.comment.getComments()
])
```

## 🔍 调试技巧

### 查看请求日志

所有请求都会在控制台打印详细日志：

```javascript
// 在微信开发者工具控制台查看
console.log('查看所有 HTTP 请求日志')
```

### 网络面板

在微信开发者工具的网络面板中可以看到所有请求的详细信息。

### 错误追踪

```typescript
// 捕获并记录错误
try {
  await api.user.getUserInfo()
} catch (error) {
  console.error('请求失败:', {
    url: error.config?.url,
    method: error.config?.method,
    code: error.code,
    message: error.message
  })
}
```

## 📝 最佳实践

### 1. 使用 Hook 进行数据获取

```typescript
// ✅ 推荐：使用 Hook
const { data, loading, error } = useFetchTabList()

// ❌ 不推荐：在组件中直接调用 API
useEffect(() => {
  api.category.getCategories().then(setData)
}, [])
```

### 2. 合理的加载状态管理

```typescript
// ✅ 推荐：显示具体的加载文字
await http.post('/api/upload', data, {
  loadingText: '正在上传图片...'
})

// ❌ 不推荐：使用默认的加载文字
await http.post('/api/upload', data)
```

### 3. 错误处理策略

```typescript
// ✅ 推荐：针对重要操作自定义错误处理
try {
  await api.user.updateCriticalInfo(data)
  Taro.showToast({ title: '保存成功', icon: 'success' })
} catch (error) {
  // 重要操作失败时的特殊处理
  Taro.showModal({
    title: '保存失败',
    content: '请检查网络连接后重试',
    showCancel: true
  })
}

// ✅ 推荐：非重要操作使用自动错误处理
await api.log.recordAction(action) // 自动处理错误，不影响用户体验
```

### 4. 性能优化

```typescript
// ✅ 推荐：批量请求
const [user, settings, stats] = await Promise.all([
  api.user.getUserInfo(),
  api.user.getSettings(),
  api.user.getStats()
])

// ❌ 不推荐：串行请求
const user = await api.user.getUserInfo()
const settings = await api.user.getSettings()
const stats = await api.user.getStats()
```

## 🆘 故障排除

### 常见问题

**Q: 请求一直显示加载中**
A: 检查网络连接和服务器状态，确认 baseURL 配置正确

**Q: 认证失败**
A: 检查 token 是否正确存储，确认登录状态

**Q: 上传文件失败**
A: 检查文件路径和大小，确认服务器支持的文件类型

**Q: 跨域问题**
A: 在开发环境中使用代理配置，生产环境确保服务器配置正确的 CORS

### 调试命令

```typescript
// 查看当前认证状态
console.log('Token:', Taro.getStorageSync('token'))
console.log('OpenID:', Taro.getStorageSync('openid'))

// 测试网络连接
await http.get('/api/health', { showError: false })
  .then(() => console.log('网络连接正常'))
  .catch(() => console.log('网络连接异常'))
```

---

通过使用基于 `Taro.request` 的 HTTP 服务，您可以获得：

✅ **完美的跨平台兼容性**  
✅ **零配置的网络请求**  
✅ **统一的错误处理**  
✅ **智能的加载状态管理**  
✅ **完整的 TypeScript 支持**  

告别 axios 兼容性问题，拥抱原生 Taro 网络请求体验！
