import Taro from '@tarojs/taro'
import { isWeapp, isH5, getCurrentEnv } from '../utils/env'

// 请求和响应的类型定义
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 请求配置接口
export interface RequestConfig {
  showLoading?: boolean
  loadingText?: string
  showError?: boolean
  timeout?: number
  headers?: Record<string, string>
  params?: Record<string, any>
}

// Taro 请求方法类型
type TaroMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'

/**
 * 基于 Taro.request 的 HTTP 服务
 * 完全兼容跨平台，无 axios 依赖问题
 */
class TaroHttpService {
  private baseURL: string
  private defaultTimeout: number
  private defaultHeaders: Record<string, string>

  constructor() {
    // 根据环境和平台设置 baseURL
    this.baseURL = this.getBaseURL()
    this.defaultTimeout = 10000
    this.defaultHeaders = {
      'content-type': 'application/json'
    }

    const currentEnv = getCurrentEnv()
    console.log('🚀 [TaroHTTP] 初始化 HTTP 服务')
    console.log('🌍 [TaroHTTP] NODE_ENV:', process.env.NODE_ENV)
    console.log('📱 [TaroHTTP] 当前平台:', currentEnv)
    console.log('🔗 [TaroHTTP] baseURL:', this.baseURL)
    console.log('✅ [TaroHTTP] 环境检测 - isWeapp:', isWeapp(), 'isH5:', isH5())
  }

  /**
   * 根据环境和平台获取正确的 baseURL
   */
  private getBaseURL(): string {
    const isDev = process.env.NODE_ENV === 'development'

    if (isDev) {
      if (isWeapp()) {
        // 微信小程序开发环境：必须使用完整的 URL
        return 'http://localhost:3000/api'
      } else if (isH5()) {
        // H5 开发环境：可以使用相对路径，通过代理转发
        return '/api'
      } else {
        // 其他小程序环境：使用完整的 URL
        return 'http://localhost:3000/api'
      }
    } else {
      // 生产环境：使用实际的 API 域名
      return 'https://your-api-domain.com/api'
    }
  }

  /**
   * 构建完整的请求 URL
   */
  private buildUrl(url: string): string {
    // 如果已经是完整URL，直接返回
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }

    // 确保URL以 / 开头
    const normalizedUrl = url.startsWith('/') ? url : `/${url}`

    // 构建完整URL
    const fullUrl = `${this.baseURL}${normalizedUrl}`

    // 验证构建的URL是否有效
    if (!this.baseURL) {
      console.error('❌ [TaroHTTP] baseURL 未配置')
      throw new Error('baseURL 未配置，无法构建请求URL')
    }

    // 微信小程序环境下，确保使用完整的URL
    if (isWeapp() && !fullUrl.startsWith('http')) {
      console.error('❌ [TaroHTTP] 微信小程序环境需要完整的URL:', fullUrl)
      throw new Error('微信小程序环境需要完整的URL')
    }

    return fullUrl
  }

  /**
   * 构建查询参数
   */
  private buildQueryString(params: Record<string, any>): string {
    if (!params || Object.keys(params).length === 0) {
      return ''
    }

    const query = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')

    return query ? `?${query}` : ''
  }

  /**
   * 获取认证头
   */
  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {}

    try {
      const token = Taro.getStorageSync('token')
      const openid = Taro.getStorageSync('openid')

      if (token) {
        headers.Authorization = `Bearer ${token}`
      } else if (openid) {
        headers['X-OpenId'] = openid
      }
    } catch (error) {
      console.warn('⚠️ [TaroHTTP] 无法获取认证信息:', error)
    }

    return headers
  }

  /**
   * 处理业务错误
   */
  private handleBusinessError(data: ApiResponse, showError: boolean = true): void {
    const errorMessage = data.message || '请求失败'

    console.error('❌ [TaroHTTP] 业务错误:', data)

    // 特定错误码处理
    switch (data.code) {
      case 401:
        // 未授权，清除登录信息
        try {
          Taro.removeStorageSync('token')
          Taro.removeStorageSync('openid')
          Taro.removeStorageSync('session_key')
          Taro.removeStorageSync('userInfo')
        } catch (e) {
          console.warn('⚠️ [TaroHTTP] 清除登录信息失败:', e)
        }

        if (showError) {
          Taro.showModal({
            title: '登录已过期',
            content: '请重新登录后继续使用',
            showCancel: false,
            confirmText: '确定'
          })
        }
        break
      case 403:
        if (showError) {
          Taro.showToast({ title: '没有权限', icon: 'none' })
        }
        break
      case 404:
        if (showError) {
          Taro.showToast({ title: '资源不存在', icon: 'none' })
        }
        break
      default:
        if (showError) {
          Taro.showToast({ title: errorMessage, icon: 'none' })
        }
    }
  }

  /**
   * 处理网络错误
   */
  private handleNetworkError(error: any, showError: boolean = true): void {
    let errorMessage = '网络错误'

    console.error('❌ [TaroHTTP] 网络错误:', error)

    // 根据错误信息判断错误类型
    if (error.errMsg) {
      if (error.errMsg.includes('timeout')) {
        errorMessage = '请求超时，请检查网络连接'
      } else if (error.errMsg.includes('fail')) {
        errorMessage = '网络连接失败'
      } else {
        errorMessage = error.errMsg
      }
    }

    if (showError) {
      Taro.showToast({
        title: errorMessage,
        icon: 'none',
        duration: 2000
      })
    }
  }

  /**
   * 核心请求方法
   */
  private async request<T = any>(
    method: TaroMethod,
    url: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      showLoading = true,
      loadingText = '加载中...',
      showError = true,
      timeout = this.defaultTimeout,
      headers = {},
      params
    } = config

    // 显示加载提示
    if (showLoading) {
      try {
        Taro.showLoading({
          title: loadingText,
          mask: true
        })
      } catch (error) {
        console.warn('⚠️ [TaroHTTP] 无法显示加载提示:', error)
      }
    }

    // 构建请求 URL
    let requestUrl = this.buildUrl(url)
    if (params && method === 'GET') {
      requestUrl += this.buildQueryString(params)
    }

    // 构建请求头
    const requestHeaders = {
      ...this.defaultHeaders,
      ...this.getAuthHeaders(),
      ...headers
    }

    // 构建请求数据
    let requestData = data
    if (method === 'GET' && params) {
      requestData = undefined // GET 请求参数已添加到 URL
    } else if (data && typeof data === 'object') {
      requestData = data
    }

    console.log('📤 [TaroHTTP] 发送请求:', {
      method,
      url: requestUrl,
      headers: requestHeaders,
      data: requestData
    })

    try {
      const response = await Taro.request({
        url: requestUrl,
        method,
        data: requestData,
        header: requestHeaders,
        timeout
      })

      console.log('📥 [TaroHTTP] 收到响应:', {
        statusCode: response.statusCode,
        data: response.data
      })

      // 隐藏加载提示
      if (showLoading) {
        try {
          Taro.hideLoading()
        } catch (error) {
          console.warn('⚠️ [TaroHTTP] 无法隐藏加载提示:', error)
        }
      }

      // 检查 HTTP 状态码
      if (response.statusCode >= 200 && response.statusCode < 300) {
        const responseData = response.data as ApiResponse<T>

        // 检查业务状态码
        if (responseData && typeof responseData === 'object' && 'code' in responseData) {
          if (responseData.code === 200 || responseData.code === 0) {
            return responseData
          } else {
            this.handleBusinessError(responseData, showError)
            throw responseData
          }
        } else {
          // 如果没有标准的业务状态码，包装响应数据
          return {
            code: 200,
            message: 'success',
            data: responseData as T
          }
        }
      } else {
        // HTTP 错误
        const error = {
          statusCode: response.statusCode,
          errMsg: `HTTP ${response.statusCode}`,
          data: response.data
        }
        this.handleNetworkError(error, showError)
        throw error
      }
    } catch (error) {
      console.error('❌ [TaroHTTP] 请求异常:', error)

      // 隐藏加载提示
      if (showLoading) {
        try {
          Taro.hideLoading()
        } catch (e) {
          console.warn('⚠️ [TaroHTTP] 无法隐藏加载提示:', e)
        }
      }

      // 如果是业务错误，直接抛出
      if (error && typeof error === 'object' && 'code' in error) {
        throw error
      }

      // 处理网络错误
      this.handleNetworkError(error, showError)
      throw error
    }
  }

  /**
   * GET 请求
   */
  get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, config)
  }

  /**
   * POST 请求
   */
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data, config)
  }

  /**
   * PUT 请求
   */
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data, config)
  }

  /**
   * DELETE 请求
   */
  delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, config)
  }

  /**
   * PATCH 请求
   */
  patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', url, data, config)
  }

  /**
   * 文件上传
   */
  upload<T = any>(
    url: string,
    filePath: string,
    name: string = 'file',
    formData?: Record<string, any>,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      showLoading = true,
      loadingText = '上传中...',
      showError = true,
      timeout = this.defaultTimeout,
      headers = {}
    } = config

    return new Promise((resolve, reject) => {
      // 显示加载提示
      if (showLoading) {
        try {
          Taro.showLoading({
            title: loadingText,
            mask: true
          })
        } catch (error) {
          console.warn('⚠️ [TaroHTTP] 无法显示加载提示:', error)
        }
      }

      // 构建请求头
      const requestHeaders = {
        ...this.getAuthHeaders(),
        ...headers
      }

      console.log('📤 [TaroHTTP] 上传文件:', {
        url: this.buildUrl(url),
        filePath,
        name,
        formData,
        headers: requestHeaders
      })

      const uploadTask = Taro.uploadFile({
        url: this.buildUrl(url),
        filePath,
        name,
        formData,
        header: requestHeaders,
        timeout,
        success: (res) => {
          console.log('📥 [TaroHTTP] 上传成功:', res)

          // 隐藏加载提示
          if (showLoading) {
            try {
              Taro.hideLoading()
            } catch (error) {
              console.warn('⚠️ [TaroHTTP] 无法隐藏加载提示:', error)
            }
          }

          try {
            const data = JSON.parse(res.data) as ApiResponse<T>
            if (data.code === 200 || data.code === 0) {
              resolve(data)
            } else {
              this.handleBusinessError(data, showError)
              reject(data)
            }
          } catch (parseError) {
            console.error('❌ [TaroHTTP] 解析上传响应失败:', parseError)
            const error = { code: -1, message: '响应数据解析失败', data: null }
            if (showError) {
              Taro.showToast({ title: '上传失败', icon: 'none' })
            }
            reject(error)
          }
        },
        fail: (error) => {
          console.error('❌ [TaroHTTP] 上传失败:', error)

          // 隐藏加载提示
          if (showLoading) {
            try {
              Taro.hideLoading()
            } catch (e) {
              console.warn('⚠️ [TaroHTTP] 无法隐藏加载提示:', e)
            }
          }

          this.handleNetworkError(error, showError)
          reject({ code: -1, message: '上传失败', data: error })
        }
      })

      // 监听上传进度
      if (uploadTask.onProgressUpdate) {
        uploadTask.onProgressUpdate((res) => {
          console.log('📊 [TaroHTTP] 上传进度:', `${res.progress}%`)
        })
      }
    })
  }

  /**
   * 下载文件
   */
  download(
    url: string,
    config: RequestConfig = {}
  ): Promise<{ tempFilePath: string }> {
    const {
      showLoading = true,
      loadingText = '下载中...',
      showError = true,
      headers = {}
    } = config

    return new Promise((resolve, reject) => {
      // 显示加载提示
      if (showLoading) {
        try {
          Taro.showLoading({
            title: loadingText,
            mask: true
          })
        } catch (error) {
          console.warn('⚠️ [TaroHTTP] 无法显示加载提示:', error)
        }
      }

      // 构建请求头
      const requestHeaders = {
        ...this.getAuthHeaders(),
        ...headers
      }

      console.log('📤 [TaroHTTP] 下载文件:', {
        url: this.buildUrl(url),
        headers: requestHeaders
      })

      const downloadTask = Taro.downloadFile({
        url: this.buildUrl(url),
        header: requestHeaders,
        success: (res) => {
          console.log('📥 [TaroHTTP] 下载成功:', res)

          // 隐藏加载提示
          if (showLoading) {
            try {
              Taro.hideLoading()
            } catch (error) {
              console.warn('⚠️ [TaroHTTP] 无法隐藏加载提示:', error)
            }
          }

          if (res.statusCode === 200) {
            resolve({ tempFilePath: res.tempFilePath })
          } else {
            const error = { statusCode: res.statusCode, errMsg: '下载失败' }
            this.handleNetworkError(error, showError)
            reject(error)
          }
        },
        fail: (error) => {
          console.error('❌ [TaroHTTP] 下载失败:', error)

          // 隐藏加载提示
          if (showLoading) {
            try {
              Taro.hideLoading()
            } catch (e) {
              console.warn('⚠️ [TaroHTTP] 无法隐藏加载提示:', e)
            }
          }

          this.handleNetworkError(error, showError)
          reject(error)
        }
      })

      // 监听下载进度
      if (downloadTask.onProgressUpdate) {
        downloadTask.onProgressUpdate((res) => {
          console.log('📊 [TaroHTTP] 下载进度:', `${res.progress}%`)
        })
      }
    })
  }
}

// 创建并导出 HTTP 服务实例
export const http = new TaroHttpService()

// 导出常用的请求方法
export const { get, post, put, delete: del, patch, upload, download } = http
