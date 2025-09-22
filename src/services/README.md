# HTTP 服务使用指南

本项目已从 URQL (GraphQL) 迁移到基于 Taro.request 的 HTTP 服务，提供完美的跨平台兼容性和完整的 API 服务封装。

> **重要更新**：项目已完全切换到 `Taro.request`，彻底解决了 axios 在微信小程序中的兼容性问题。详细文档请查看 `TARO_HTTP_README.md`。

## 🚀 快速开始

### 基本导入

```typescript
import { http, api } from '~/services'
// 或者
import { get, post, put, delete, patch } from '~/services'
```

### 使用预定义的 API

```typescript
import api from '~/services/api'

// 获取分类列表
const categories = await api.category.getCategories(8)

// 获取新商品
const goods = await api.goods.getNewGoods(10, 0)

// 获取用户信息
const userInfo = await api.user.getUserInfo()
```

### 使用自定义 Hook

```typescript
import { useFetchTabList, useFetchRecommendedStudy } from '~/schema/home'

function MyComponent() {
  const { data, loading, error } = useFetchTabList()
  
  if (loading) return <Loading />
  if (error) return <Error message={error} />
  
  return <div>{/* 渲染数据 */}</div>
}
```

## 📖 详细用法

### 1. HTTP 服务 (`http`)

#### 基本请求方法

```typescript
import { http } from '~/services'

// GET 请求
const response = await http.get('/api/users')

// POST 请求
const response = await http.post('/api/users', {
  name: '张三',
  email: 'zhangsan@example.com'
})

// PUT 请求
const response = await http.put('/api/users/1', userData)

// DELETE 请求
const response = await http.delete('/api/users/1')
```

#### 请求配置选项

```typescript
// 自定义加载提示
await http.get('/api/data', {
  showLoading: true,           // 是否显示加载提示
  loadingText: '数据加载中...',  // 加载提示文字
  showError: true              // 是否显示错误提示
})

// 不显示加载提示
await http.get('/api/data', {
  showLoading: false
})
```

#### 文件上传

```typescript
import { upload } from '~/services'

// 上传单个文件
const result = await upload('/upload', filePath, 'avatar')

// 上传文件并附加表单数据
const result = await upload('/upload', filePath, 'file', {
  userId: '123',
  category: 'profile'
})
```

### 2. API 服务 (`api`)

#### 分类 API

```typescript
import api from '~/services/api'

// 获取分类列表
const categories = await api.category.getCategories(8)
```

#### 商品 API

```typescript
// 获取新商品
const newGoods = await api.goods.getNewGoods(10, 0)

// 获取热门商品
const hotGoods = await api.goods.getHotGoods(10)

// 获取商品详情
const goodsDetail = await api.goods.getGoodsDetail('123')

// 根据分类获取商品
const categoryGoods = await api.goods.getGoodsByCategory('cat1', 10, 0)
```

#### 学习 API

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

#### 知识点 API

```typescript
// 获取知识点列表
const knowledge = await api.knowledge.getKnowledgePoints()

// 按分类筛选
const knowledge = await api.knowledge.getKnowledgePoints('javascript')

// 搜索知识点
const searchResults = await api.knowledge.searchKnowledge('react hooks')
```

#### 练习 API

```typescript
// 获取练习列表
const practices = await api.practice.getPracticeList()

// 提交练习答案
await api.practice.submitPractice('practice123', answers)

// 获取练习结果
const result = await api.practice.getPracticeResult('practice123')
```

#### 用户 API

```typescript
// 获取用户信息
const userInfo = await api.user.getUserInfo()

// 更新用户信息
await api.user.updateUserInfo(newUserInfo)

// 获取用户学习统计
const stats = await api.user.getUserStats()
```

### 3. 自定义 Hook

#### 现有 Hook

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
  
  return (
    <div>
      {loading && <div>加载中...</div>}
      {error && <div>错误: {error}</div>}
      {/* 渲染数据 */}
    </div>
  )
}
```

#### 创建自定义 Hook

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
      } catch (err) {
        setError(err.message)
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

## 🔧 配置说明

### 开发环境代理

开发环境会自动将 `/api` 请求代理到 `http://localhost:3000`：

```typescript
// config/dev.ts
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false,
  },
}
```

### 生产环境配置

生产环境需要在 `src/services/http.ts` 中配置实际的 API 地址：

```typescript
baseURL: process.env.NODE_ENV === 'development' 
  ? '/api' 
  : 'https://your-api-domain.com/api'
```

### 请求拦截器

系统会自动处理：
- 显示/隐藏加载提示
- 添加 Authorization 头
- 错误处理和提示

### 响应拦截器

系统会自动处理：
- 业务状态码判断
- 错误提示显示
- 登录状态检查

## 🎯 最佳实践

### 1. 使用 Hook 进行数据获取

```typescript
// ✅ 推荐：使用 Hook
const { data, loading, error } = useFetchTabList()

// ❌ 不推荐：在组件中直接调用 API
useEffect(() => {
  api.category.getCategories().then(setData)
}, [])
```

### 2. 错误处理

```typescript
// ✅ Hook 自动处理错误
const { data, loading, error } = useFetchTabList()
if (error) return <ErrorComponent message={error} />

// ✅ 手动调用时的错误处理
try {
  const data = await api.user.updateUserInfo(info)
  Taro.showToast({ title: '更新成功', icon: 'success' })
} catch (error) {
  // 错误已由拦截器处理，这里可以做额外处理
  console.error('更新失败:', error)
}
```

### 3. 加载状态管理

```typescript
// ✅ Hook 自动管理加载状态
const { data, loading } = useFetchTabList()
if (loading) return <LoadingComponent />

// ✅ 手动调用时管理加载状态
const [loading, setLoading] = useState(false)
const handleSubmit = async () => {
  setLoading(true)
  try {
    await api.user.updateUserInfo(data)
  } finally {
    setLoading(false)
  }
}
```

### 4. 类型安全

```typescript
import { Category, Goods, StudyItem } from '~/services'

// ✅ 使用预定义类型
const categories: Category[] = await api.category.getCategories()

// ✅ 自定义类型
interface CustomResponse {
  list: Goods[]
  total: number
}

const response = await http.get<CustomResponse>('/api/custom')
```

## 🔄 迁移指南

### 从 URQL 迁移

```typescript
// ❌ 旧的 URQL 方式
import { useQuery } from 'urql'
const [{ data, fetching, error }] = useQuery({ query: fetchTabs })

// ✅ 新的 Axios 方式
import { useFetchTabList } from '~/schema/home'
const { data, loading, error } = useFetchTabList()
```

### GraphQL 到 REST API 映射

```typescript
// ❌ GraphQL 查询
const fetchTabs = graphql(`
  query FetchTabs {
    litemallCategory(limit: 8) { id name iconUrl }
  }
`)

// ✅ REST API 调用
const categories = await api.category.getCategories(8)
```

## 📝 注意事项

1. **网络请求只在真机或模拟器中有效**，开发者工具可能有限制
2. **生产环境记得修改 baseURL**
3. **token 会自动从本地存储获取并添加到请求头**
4. **所有网络错误都会自动显示 Toast 提示**
5. **支持请求和响应拦截器的自定义扩展**

## 🆘 常见问题

### Q: 如何添加新的 API 接口？

A: 在 `src/services/api.ts` 中添加新的方法：

```typescript
export const newApi = {
  getData: () => http.get('/new-endpoint'),
  postData: (data: any) => http.post('/new-endpoint', data),
}

// 在 default export 中添加
export default {
  // ... existing apis
  new: newApi,
}
```

### Q: 如何自定义错误处理？

A: 修改 `src/services/http.ts` 中的 `handleBusinessError` 和 `handleHttpError` 方法。

### Q: 如何禁用自动加载提示？

A: 在请求时设置 `showLoading: false`：

```typescript
await http.get('/api/data', { showLoading: false })
```

### Q: 如何上传多个文件？

A: 可以循环调用 `upload` 方法，或者扩展 `upload` 方法支持多文件。
