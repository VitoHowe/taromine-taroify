import Taro from '@tarojs/taro'

/**
 * 环境检测工具函数
 */

// 检查是否为微信小程序环境
export const isWeapp = (): boolean => {
  try {
    return Taro.getEnv() === Taro.ENV_TYPE.WEAPP
  } catch (error) {
    console.warn('无法获取 Taro 环境信息:', error)
    return false
  }
}

// 检查是否为 H5 环境
export const isH5 = (): boolean => {
  try {
    return Taro.getEnv() === Taro.ENV_TYPE.WEB
  } catch (error) {
    console.warn('无法获取 Taro 环境信息:', error)
    return false
  }
}

// 检查是否为 React Native 环境
export const isRN = (): boolean => {
  try {
    return Taro.getEnv() === Taro.ENV_TYPE.RN
  } catch (error) {
    console.warn('无法获取 Taro 环境信息:', error)
    return false
  }
}

// 检查是否为支付宝小程序环境
export const isAlipay = (): boolean => {
  try {
    return Taro.getEnv() === Taro.ENV_TYPE.ALIPAY
  } catch (error) {
    console.warn('无法获取 Taro 环境信息:', error)
    return false
  }
}

// 检查是否为字节跳动小程序环境
export const isTT = (): boolean => {
  try {
    return Taro.getEnv() === Taro.ENV_TYPE.TT
  } catch (error) {
    console.warn('无法获取 Taro 环境信息:', error)
    return false
  }
}

// 检查是否为 QQ 小程序环境
export const isQQ = (): boolean => {
  try {
    return Taro.getEnv() === Taro.ENV_TYPE.QQ
  } catch (error) {
    console.warn('无法获取 Taro 环境信息:', error)
    return false
  }
}

// 检查是否为京东小程序环境
export const isJD = (): boolean => {
  try {
    return Taro.getEnv() === Taro.ENV_TYPE.JD
  } catch (error) {
    console.warn('无法获取 Taro 环境信息:', error)
    return false
  }
}

// 检查是否为百度小程序环境
export const isSwan = (): boolean => {
  try {
    return Taro.getEnv() === Taro.ENV_TYPE.SWAN
  } catch (error) {
    console.warn('无法获取 Taro 环境信息:', error)
    return false
  }
}

// 获取当前环境名称
export const getCurrentEnv = (): string => {
  try {
    const env = Taro.getEnv()
    const envMap = {
      [Taro.ENV_TYPE.WEAPP]: 'weapp',
      [Taro.ENV_TYPE.WEB]: 'h5',
      [Taro.ENV_TYPE.RN]: 'rn',
      [Taro.ENV_TYPE.SWAN]: 'swan',
      [Taro.ENV_TYPE.ALIPAY]: 'alipay',
      [Taro.ENV_TYPE.TT]: 'tt',
      [Taro.ENV_TYPE.QQ]: 'qq',
      [Taro.ENV_TYPE.JD]: 'jd',
    }
    return envMap[env] || 'unknown'
  } catch (error) {
    console.warn('无法获取 Taro 环境信息:', error)
    return 'unknown'
  }
}

// 检查是否为小程序环境（任何小程序平台）
export const isMiniProgram = (): boolean => {
  return isWeapp() || isAlipay() || isTT() || isQQ() || isJD() || isSwan()
}

// 环境调试信息
export const getEnvInfo = () => {
  const currentEnv = getCurrentEnv()
  const info = {
    current: currentEnv,
    isWeapp: isWeapp(),
    isH5: isH5(),
    isRN: isRN(),
    isMiniProgram: isMiniProgram(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
    timestamp: new Date().toISOString()
  }

  console.log('🌍 [Environment Info]:', info)
  return info
}

// 环境特定的功能检查
export const getFeatureSupport = () => {
  const currentEnv = getCurrentEnv()

  const features = {
    // 登录功能支持
    login: isWeapp() || isAlipay() || isTT() || isQQ(),

    // 支付功能支持
    payment: isWeapp() || isAlipay() || isH5(),

    // 分享功能支持
    share: isMiniProgram(),

    // 地理位置支持
    location: isMiniProgram() || isH5(),

    // 相机/相册支持
    camera: isMiniProgram(),

    // 本地存储支持
    storage: true, // 所有环境都支持

    // 网络请求支持
    network: true, // 所有环境都支持

    // 路由跳转支持
    navigation: true, // 所有环境都支持
  }

  console.log(`🔧 [Feature Support] ${currentEnv}:`, features)
  return features
}

// 导出环境常量
export const ENV = {
  WEAPP: 'weapp',
  H5: 'h5',
  RN: 'rn',
  ALIPAY: 'alipay',
  TT: 'tt',
  QQ: 'qq',
  JD: 'jd',
  SWAN: 'swan'
} as const

export type EnvType = typeof ENV[keyof typeof ENV]
