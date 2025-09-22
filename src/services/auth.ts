import Taro from '@tarojs/taro'
import { http } from './http'

// 检查当前环境是否为微信小程序
const isWeappEnv = () => {
  try {
    return Taro.getEnv() === Taro.ENV_TYPE.WEAPP
  } catch (error) {
    console.warn('无法获取 Taro 环境信息:', error)
    return false
  }
}

// 登录相关的类型定义
export interface LoginResponse {
  openid: string
  session_key: string
  unionid?: string
  token?: string
  userInfo?: any
}

export interface UserInfo {
  nickName: string
  avatarUrl: string
  gender: number
  country: string
  province: string
  city: string
  language: string
}

/**
 * 微信小程序登录服务
 */
export class WxAuthService {
  private static instance: WxAuthService
  private loginPromise: Promise<LoginResponse> | null = null

  // 单例模式
  public static getInstance(): WxAuthService {
    if (!WxAuthService.instance) {
      WxAuthService.instance = new WxAuthService()
    }
    return WxAuthService.instance
  }

  /**
   * 检查本地是否有有效的登录信息
   */
  public isLoggedIn(): boolean {
    try {
      const openid = Taro.getStorageSync('openid')
      const sessionKey = Taro.getStorageSync('session_key')

      // 检查是否存在必要的登录信息
      return !!(openid && sessionKey)
    } catch (error) {
      console.error('检查登录状态失败:', error)
      return false
    }
  }

  /**
   * 获取存储的用户信息
   */
  public getStoredUserInfo(): LoginResponse | null {
    try {
      const openid = Taro.getStorageSync('openid')
      const sessionKey = Taro.getStorageSync('session_key')
      const unionid = Taro.getStorageSync('unionid')
      const token = Taro.getStorageSync('token')
      const userInfo = Taro.getStorageSync('userInfo')

      if (!openid || !sessionKey) {
        return null
      }

      return {
        openid,
        session_key: sessionKey,
        unionid,
        token,
        userInfo
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return null
    }
  }

  /**
   * 微信小程序登录
   * 如果正在登录中，返回同一个 Promise 避免重复登录
   */
  public async login(): Promise<LoginResponse> {
    // 检查是否在微信小程序环境
    if (!isWeappEnv()) {
      const error = new Error('登录功能仅在微信小程序环境下可用')
      console.warn('⚠️ [Auth] 当前环境不是微信小程序，无法执行登录')
      throw error
    }

    // 如果已经在登录中，返回同一个 Promise
    if (this.loginPromise) {
      return this.loginPromise
    }

    // 如果已经登录，直接返回存储的信息
    if (this.isLoggedIn()) {
      const userInfo = this.getStoredUserInfo()
      if (userInfo) {
        return userInfo
      }
    }

    this.loginPromise = this.performLogin()

    try {
      const result = await this.loginPromise
      return result
    } finally {
      // 无论成功失败都清除 Promise
      this.loginPromise = null
    }
  }

  /**
   * 执行实际的登录流程
   */
  private async performLogin(): Promise<LoginResponse> {
    try {
      console.log('开始微信小程序登录...')

      // 1. 调用 wx.login 获取 code
      const loginResult = await Taro.login()
      const { code } = loginResult

      if (!code) {
        throw new Error('获取微信登录 code 失败')
      }

      console.log('获取到 code:', code)

      // 2. 将 code 发送到后端获取 openid 和 session_key
      const response = await http.post<LoginResponse>('/auth/login', {
        code,
        // 可以添加其他需要的参数
        appType: 'weapp'
      }, {
        showLoading: true,
        loadingText: '登录中...'
      })

      if (!response.data) {
        throw new Error('登录响应数据为空')
      }

      const { openid, session_key, unionid, token, userInfo } = response.data

      if (!openid || !session_key) {
        throw new Error('登录响应缺少必要信息')
      }

      // 3. 存储登录信息到本地
      await this.storeUserInfo({
        openid,
        session_key,
        unionid,
        token,
        userInfo
      })

      console.log('登录成功:', { openid: openid.substring(0, 8) + '...' })

      return response.data
    } catch (error) {
      console.error('登录失败:', error)

      // 清理可能的脏数据
      this.clearUserInfo()

      // 显示错误提示
      Taro.showToast({
        title: '登录失败，请重试',
        icon: 'none',
        duration: 2000
      })

      throw error
    }
  }

  /**
   * 存储用户信息到本地
   */
  private async storeUserInfo(loginData: LoginResponse): Promise<void> {
    try {
      Taro.setStorageSync('openid', loginData.openid)
      Taro.setStorageSync('session_key', loginData.session_key)

      if (loginData.unionid) {
        Taro.setStorageSync('unionid', loginData.unionid)
      }

      if (loginData.token) {
        Taro.setStorageSync('token', loginData.token)
      }

      if (loginData.userInfo) {
        Taro.setStorageSync('userInfo', loginData.userInfo)
      }

      console.log('用户信息已存储到本地')
    } catch (error) {
      console.error('存储用户信息失败:', error)
      throw new Error('存储登录信息失败')
    }
  }

  /**
   * 清除本地用户信息
   */
  public clearUserInfo(): void {
    try {
      Taro.removeStorageSync('openid')
      Taro.removeStorageSync('session_key')
      Taro.removeStorageSync('unionid')
      Taro.removeStorageSync('token')
      Taro.removeStorageSync('userInfo')
      console.log('用户信息已清除')
    } catch (error) {
      console.error('清除用户信息失败:', error)
    }
  }

  /**
   * 登出
   */
  public async logout(): Promise<void> {
    try {
      // 可以调用后端登出接口
      // await http.post('/auth/logout')

      // 清除本地存储
      this.clearUserInfo()

      Taro.showToast({
        title: '已退出登录',
        icon: 'success'
      })

      console.log('用户已登出')
    } catch (error) {
      console.error('登出失败:', error)
      // 即使后端调用失败，也要清除本地数据
      this.clearUserInfo()
    }
  }

  /**
   * 获取用户信息（需要用户授权）
   * 注意：wx.getUserInfo 已废弃，建议使用 getUserProfile
   */
  public async getUserProfile(): Promise<UserInfo> {
    // 检查是否在微信小程序环境
    if (!isWeappEnv()) {
      const error = new Error('获取用户信息功能仅在微信小程序环境下可用')
      console.warn('⚠️ [Auth] 当前环境不是微信小程序，无法获取用户信息')
      throw error
    }

    try {
      const userProfile = await Taro.getUserProfile({
        desc: '用于完善用户资料'
      })

      const { userInfo } = userProfile

      // 可以将用户信息发送到后端保存
      // await this.updateUserProfile(userInfo)

      // 存储到本地
      Taro.setStorageSync('userInfo', userInfo)

      return userInfo
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw new Error('获取用户信息失败')
    }
  }

  /**
   * 检查登录状态是否过期
   * 可以通过调用后端接口验证 session_key 是否有效
   */
  public async checkSession(): Promise<boolean> {
    // 检查是否在微信小程序环境
    if (!isWeappEnv()) {
      console.warn('⚠️ [Auth] 当前环境不是微信小程序，跳过 session 检查')
      return false
    }

    try {
      // 1. 检查微信 session 是否有效
      await Taro.checkSession()

      // 2. 可以调用后端接口验证
      // const response = await http.get('/auth/check-session')
      // return response.data.valid

      return true
    } catch (error) {
      console.log('session 已过期')
      // session 过期，清除本地数据
      this.clearUserInfo()
      return false
    }
  }

  /**
   * 强制重新登录
   */
  public async forceLogin(): Promise<LoginResponse> {
    // 清除本地数据
    this.clearUserInfo()
    // 清除正在进行的登录 Promise
    this.loginPromise = null
    // 重新登录
    return this.login()
  }
}

// 导出单例实例
export const wxAuth = WxAuthService.getInstance()

// 导出便捷方法
export const {
  login,
  logout,
  isLoggedIn,
  getStoredUserInfo,
  getUserProfile,
  checkSession,
  forceLogin,
  clearUserInfo
} = wxAuth
