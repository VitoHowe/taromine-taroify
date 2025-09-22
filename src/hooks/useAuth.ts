import { useState, useEffect, useCallback } from 'react'
import Taro from '@tarojs/taro'
import { wxAuth, LoginResponse } from '~/services/auth'

export interface AuthState {
  isLoggedIn: boolean
  isLoading: boolean
  userInfo: LoginResponse | null
  error: string | null
}

/**
 * 登录状态管理 Hook
 */
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    isLoading: true,
    userInfo: null,
    error: null
  })

  // 检查登录状态
  const checkLoginStatus = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

      // 检查本地存储的登录状态
      const isLoggedIn = wxAuth.isLoggedIn()
      const userInfo = wxAuth.getStoredUserInfo()

      if (isLoggedIn && userInfo) {
        // 检查 session 是否有效
        const isSessionValid = await wxAuth.checkSession()

        if (isSessionValid) {
          setAuthState({
            isLoggedIn: true,
            isLoading: false,
            userInfo,
            error: null
          })
          return true
        }
      }

      // 如果没有登录或 session 无效
      setAuthState({
        isLoggedIn: false,
        isLoading: false,
        userInfo: null,
        error: null
      })
      return false
    } catch (error) {
      console.error('检查登录状态失败:', error)
      setAuthState({
        isLoggedIn: false,
        isLoading: false,
        userInfo: null,
        error: error instanceof Error ? error.message : '检查登录状态失败'
      })
      return false
    }
  }, [])

  // 登录
  const login = useCallback(async (): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

      const loginResult = await wxAuth.login()

      setAuthState({
        isLoggedIn: true,
        isLoading: false,
        userInfo: loginResult,
        error: null
      })

      return true
    } catch (error) {
      console.error('登录失败:', error)
      setAuthState({
        isLoggedIn: false,
        isLoading: false,
        userInfo: null,
        error: error instanceof Error ? error.message : '登录失败'
      })
      return false
    }
  }, [])

  // 登出
  const logout = useCallback(async (): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))

      await wxAuth.logout()

      setAuthState({
        isLoggedIn: false,
        isLoading: false,
        userInfo: null,
        error: null
      })
    } catch (error) {
      console.error('登出失败:', error)
      // 即使登出失败，也要更新本地状态
      setAuthState({
        isLoggedIn: false,
        isLoading: false,
        userInfo: null,
        error: error instanceof Error ? error.message : '登出失败'
      })
    }
  }, [])

  // 强制重新登录
  const forceLogin = useCallback(async (): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

      const loginResult = await wxAuth.forceLogin()

      setAuthState({
        isLoggedIn: true,
        isLoading: false,
        userInfo: loginResult,
        error: null
      })

      return true
    } catch (error) {
      console.error('强制登录失败:', error)
      setAuthState({
        isLoggedIn: false,
        isLoading: false,
        userInfo: null,
        error: error instanceof Error ? error.message : '登录失败'
      })
      return false
    }
  }, [])

  // 获取用户授权信息
  const getUserProfile = useCallback(async () => {
    try {
      const userProfile = await wxAuth.getUserProfile()

      // 更新本地状态
      if (authState.userInfo) {
        const updatedUserInfo = {
          ...authState.userInfo,
          userInfo: userProfile
        }
        setAuthState(prev => ({
          ...prev,
          userInfo: updatedUserInfo
        }))
      }

      return userProfile
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }, [authState.userInfo])

  // 组件挂载时检查登录状态
  useEffect(() => {
    checkLoginStatus()
  }, [checkLoginStatus])

  return {
    // 状态
    ...authState,

    // 方法
    login,
    logout,
    forceLogin,
    checkLoginStatus,
    getUserProfile,

    // 便捷属性
    openid: authState.userInfo?.openid || null,
    sessionKey: authState.userInfo?.session_key || null,
    token: authState.userInfo?.token || null
  }
}

/**
 * 登录守卫 Hook
 * 用于需要登录才能访问的页面
 */
export function useAuthGuard(options: {
  redirectOnFail?: boolean
  showToast?: boolean
} = {}) {
  const { redirectOnFail = false, showToast = true } = options
  const auth = useAuth()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      if (auth.isLoading) return

      if (!auth.isLoggedIn) {
        if (showToast) {
          Taro.showToast({
            title: '请先登录',
            icon: 'none'
          })
        }

        if (redirectOnFail) {
          // 可以跳转到登录页面
          // Taro.redirectTo({ url: '/pages/login/index' })

          // 或者尝试自动登录
          const loginSuccess = await auth.login()
          if (loginSuccess) {
            setIsReady(true)
          }
        }
      } else {
        setIsReady(true)
      }
    }

    checkAuth()
  }, [auth.isLoggedIn, auth.isLoading, redirectOnFail, showToast, auth])

  return {
    ...auth,
    isReady: isReady && auth.isLoggedIn
  }
}

/**
 * Tab 切换登录检查 Hook
 */
export function useTabLoginCheck() {
  const auth = useAuth()

  const checkLoginOnTabSwitch = useCallback(async (): Promise<boolean> => {
    try {
      // 如果正在加载，等待加载完成
      if (auth.isLoading) {
        return false
      }

      // 如果已经登录，检查 session 是否有效
      if (auth.isLoggedIn) {
        const isSessionValid = await wxAuth.checkSession()
        if (isSessionValid) {
          return true
        }
      }

      // 如果没有登录或 session 无效，尝试登录
      console.log('Tab 切换检测到未登录，尝试自动登录...')
      const loginSuccess = await auth.login()

      if (loginSuccess) {
        Taro.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1500
        })
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Tab 切换登录检查失败:', error)
      return false
    }
  }, [auth])

  return {
    checkLoginOnTabSwitch,
    isLoggedIn: auth.isLoggedIn,
    isLoading: auth.isLoading
  }
}
