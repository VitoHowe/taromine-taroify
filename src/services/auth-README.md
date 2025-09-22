# 微信小程序登录功能使用指南

本项目已集成完整的微信小程序登录功能，支持自动登录验证、Tab 切换检查等特性。

## 🚀 快速开始

### 基本导入

```typescript
import { useAuth, useAuthGuard, useTabLoginCheck } from '~/hooks/useAuth'
import { wxAuth, login, logout } from '~/services/auth'
import { LoginModal, LoginButton, UserInfoCard } from '~/components/LoginModal'
```

## 📖 核心功能

### 1. 登录服务 (`wxAuth`)

#### 基本使用

```typescript
import { wxAuth } from '~/services/auth'

// 检查登录状态
const isLoggedIn = wxAuth.isLoggedIn()

// 登录
const loginResult = await wxAuth.login()

// 登出
await wxAuth.logout()

// 获取用户信息
const userInfo = wxAuth.getStoredUserInfo()

// 检查 session 有效性
const isValid = await wxAuth.checkSession()
```

#### 高级功能

```typescript
// 强制重新登录
await wxAuth.forceLogin()

// 获取用户授权信息（头像昵称）
const userProfile = await wxAuth.getUserProfile()

// 清除用户信息
wxAuth.clearUserInfo()
```

### 2. 登录状态 Hook (`useAuth`)

#### 基本用法

```typescript
import { useAuth } from '~/hooks/useAuth'

function MyComponent() {
  const {
    isLoggedIn,      // 是否已登录
    isLoading,       // 是否正在加载
    userInfo,        // 用户信息
    error,           // 错误信息
    login,           // 登录方法
    logout,          // 登出方法
    getUserProfile,  // 获取用户授权信息
    openid,          // 用户 openid
    sessionKey,      // session key
    token            // token（如果有）
  } = useAuth()

  if (isLoading) return <Loading />
  if (error) return <Error message={error} />
  if (!isLoggedIn) return <LoginButton />

  return <div>用户已登录: {userInfo?.openid}</div>
}
```

### 3. 登录守卫 Hook (`useAuthGuard`)

用于需要登录才能访问的页面：

```typescript
import { useAuthGuard } from '~/hooks/useAuth'

function ProtectedPage() {
  const { isReady, isLoggedIn, login } = useAuthGuard({
    redirectOnFail: true,  // 登录失败时是否重定向
    showToast: true        // 是否显示提示
  })

  if (!isReady) {
    return <Loading />
  }

  return <div>受保护的页面内容</div>
}
```

### 4. Tab 切换登录检查 (`useTabLoginCheck`)

在 TabBar 组件中使用：

```typescript
import { useTabLoginCheck } from '~/hooks/useAuth'

function TabBar() {
  const { checkLoginOnTabSwitch, isLoading } = useTabLoginCheck()

  const handleTabChange = async (index: number) => {
    // 检查登录状态
    const isValid = await checkLoginOnTabSwitch()
    
    if (isValid) {
      // 继续切换 Tab
      switchToTab(index)
    } else {
      // 阻止切换或显示登录提示
      console.log('登录验证失败')
    }
  }

  return (
    // TabBar JSX
  )
}
```

## 🎨 UI 组件

### 1. 登录弹窗 (`LoginModal`)

```typescript
import { LoginModal } from '~/components/LoginModal'

function MyPage() {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div>
      <button onClick={() => setShowLogin(true)}>显示登录</button>
      
      <LoginModal
        visible={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={() => {
          console.log('登录成功')
          setShowLogin(false)
        }}
        title="需要登录"
        description="请先登录后再继续使用"
      />
    </div>
  )
}
```

### 2. 登录按钮 (`LoginButton`)

```typescript
import { LoginButton } from '~/components/LoginModal'

function MyComponent() {
  return (
    <LoginButton
      onSuccess={() => console.log('登录成功')}
      className="custom-style"
    >
      点击登录
    </LoginButton>
  )
}
```

### 3. 用户信息卡片 (`UserInfoCard`)

```typescript
import { UserInfoCard } from '~/components/LoginModal'

function ProfilePage() {
  return (
    <div>
      <UserInfoCard className="mb-4" />
    </div>
  )
}
```

## 🔧 配置说明

### 1. 后端接口要求

登录接口应该接收以下参数：

```typescript
POST /api/auth/login
{
  "code": "微信登录 code",
  "appType": "weapp"
}
```

返回数据格式：

```typescript
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "openid": "用户 openid",
    "session_key": "会话密钥",
    "unionid": "unionid（可选）",
    "token": "JWT token（可选）",
    "userInfo": "用户信息（可选）"
  }
}
```

### 2. 小程序配置

确保在 `project.config.json` 中配置了正确的 `appid`：

```json
{
  "appid": "your-miniprogram-appid",
  "setting": {
    "urlCheck": false
  }
}
```

### 3. 开发环境代理

开发环境的 API 代理已配置在 `config/dev.ts`：

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false,
  },
}
```

## 🎯 使用场景

### 场景 1：页面级登录检查

```typescript
function MyPage() {
  const { isLoggedIn, login } = useAuth()

  useEffect(() => {
    if (!isLoggedIn) {
      // 自动尝试登录
      login()
    }
  }, [isLoggedIn, login])

  return <div>页面内容</div>
}
```

### 场景 2：API 调用前检查登录

```typescript
import { useAuth } from '~/hooks/useAuth'
import api from '~/services/api'

function useApiCall() {
  const { isLoggedIn, login } = useAuth()

  const callAPI = async () => {
    if (!isLoggedIn) {
      const success = await login()
      if (!success) return
    }

    // 调用 API
    return api.user.getUserInfo()
  }

  return { callAPI }
}
```

### 场景 3：条件渲染

```typescript
function ConditionalContent() {
  const { isLoggedIn, isLoading } = useAuth()

  if (isLoading) {
    return <Loading />
  }

  return (
    <div>
      {isLoggedIn ? (
        <UserDashboard />
      ) : (
        <div>
          <h2>请先登录</h2>
          <LoginButton />
        </div>
      )}
    </div>
  )
}
```

### 场景 4：自动重新登录

```typescript
// 在应用启动时或网络错误时
function App() {
  const { checkLoginStatus } = useAuth()

  useEffect(() => {
    // 应用启动时检查登录状态
    checkLoginStatus()
  }, [])

  // 网络请求失败时的重试逻辑
  const handleNetworkError = async () => {
    const isValid = await checkLoginStatus()
    if (!isValid) {
      // 尝试重新登录
      await login()
    }
  }

  return <div>应用内容</div>
}
```

## 🔄 登录流程

### 完整登录流程

1. **检查本地存储**：检查是否有 `openid` 和 `session_key`
2. **验证 session**：调用 `wx.checkSession()` 验证会话是否有效
3. **获取 code**：调用 `wx.login()` 获取临时登录凭证
4. **后端验证**：将 `code` 发送到后端 `/api/auth/login` 接口
5. **存储信息**：将返回的 `openid` 和 `session_key` 存储到本地
6. **更新状态**：更新应用的登录状态

### Tab 切换检查流程

1. **用户点击 Tab**
2. **检查登录状态**：调用 `checkLoginOnTabSwitch()`
3. **验证 session**：检查当前 session 是否有效
4. **自动登录**：如果无效，尝试自动重新登录
5. **继续/阻止**：根据登录结果决定是否允许 Tab 切换

## 🚨 注意事项

### 1. 权限申请

获取用户头像昵称需要用户主动授权：

```typescript
// 用户点击按钮后才能调用
const handleGetProfile = async () => {
  try {
    const userProfile = await wxAuth.getUserProfile()
    console.log('用户信息:', userProfile)
  } catch (error) {
    console.log('用户拒绝授权')
  }
}
```

### 2. 错误处理

```typescript
const { login, error } = useAuth()

const handleLogin = async () => {
  try {
    await login()
  } catch (error) {
    // 错误已由 Hook 自动处理
    console.log('登录失败:', error)
  }
}
```

### 3. 性能优化

- 登录状态检查会自动缓存结果
- 避免重复调用登录接口
- 使用单例模式管理登录服务

### 4. 调试技巧

```typescript
// 开启调试日志
console.log('登录状态:', wxAuth.isLoggedIn())
console.log('用户信息:', wxAuth.getStoredUserInfo())

// 清除登录状态（用于测试）
wxAuth.clearUserInfo()
```

## 🔍 故障排除

### 常见问题

1. **登录失败**：检查网络连接和后端接口
2. **session 过期**：会自动重新登录
3. **权限被拒绝**：引导用户重新授权
4. **Tab 切换被阻止**：检查登录验证逻辑

### 调试方法

```typescript
// 查看详细错误信息
const { error } = useAuth()
console.log('登录错误:', error)

// 手动触发登录检查
const { checkLoginStatus } = useAuth()
await checkLoginStatus()

// 查看存储的数据
console.log('OpenID:', Taro.getStorageSync('openid'))
console.log('Session Key:', Taro.getStorageSync('session_key'))
```

这个登录系统提供了完整的微信小程序登录解决方案，支持自动登录、状态管理、UI 组件等功能，可以满足大多数小程序的登录需求。
