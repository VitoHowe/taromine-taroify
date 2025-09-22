import { View, Text, Button } from '@tarojs/components'
import { Popup, Loading } from '@taroify/core'
import { useState } from 'react'
import { useAuth } from '~/hooks/useAuth'

interface LoginModalProps {
  visible: boolean
  onClose: () => void
  onSuccess?: () => void
  title?: string
  description?: string
}

/**
 * 登录弹窗组件
 */
export default function LoginModal({
  visible,
  onClose,
  onSuccess,
  title = '需要登录',
  description = '请先登录后再继续使用'
}: LoginModalProps) {
  const { login, isLoading } = useAuth()
  const [loginAttempting, setLoginAttempting] = useState(false)

  const handleLogin = async () => {
    try {
      setLoginAttempting(true)
      const success = await login()

      if (success) {
        onSuccess?.()
        onClose()
      }
    } catch (error) {
      console.error('登录失败:', error)
    } finally {
      setLoginAttempting(false)
    }
  }

  const handleCancel = () => {
    if (!loginAttempting) {
      onClose()
    }
  }

  return (
    <Popup open={visible} placement="center" onClose={handleCancel}>
      <View className="bg-white rounded-2xl p-6 mx-4 min-w-[280px]">
        {/* 标题 */}
        <View className="text-center mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </Text>
          <Text className="text-sm text-gray-600">
            {description}
          </Text>
        </View>

        {/* 登录状态 */}
        {(isLoading || loginAttempting) && (
          <View className="flex justify-center items-center py-4">
            <Loading size="20px" />
            <Text className="ml-2 text-sm text-gray-600">登录中...</Text>
          </View>
        )}

        {/* 按钮组 */}
        {!isLoading && !loginAttempting && (
          <View className="flex space-x-3 mt-6">
            <Button
              className="flex-1 bg-gray-100 text-gray-700 rounded-lg py-3"
              onClick={handleCancel}
            >
              取消
            </Button>
            <Button
              className="flex-1 bg-blue-600 text-white rounded-lg py-3"
              onClick={handleLogin}
            >
              立即登录
            </Button>
          </View>
        )}
      </View>
    </Popup>
  )
}

/**
 * 简单的登录按钮组件
 */
export function LoginButton({
  onSuccess,
  className = '',
  children = '立即登录'
}: {
  onSuccess?: () => void
  className?: string
  children?: React.ReactNode
}) {
  const { login, isLoading } = useAuth()

  const handleLogin = async () => {
    try {
      const success = await login()
      if (success) {
        onSuccess?.()
      }
    } catch (error) {
      console.error('登录失败:', error)
    }
  }

  return (
    <Button
      className={`bg-blue-600 text-white rounded-lg py-3 px-6 ${className}`}
      onClick={handleLogin}
      disabled={isLoading}
    >
      {isLoading ? '登录中...' : children}
    </Button>
  )
}

/**
 * 用户信息卡片组件
 */
export function UserInfoCard({ className = '' }: { className?: string }) {
  const { isLoggedIn, userInfo, getUserProfile, logout } = useAuth()
  const [profileLoading, setProfileLoading] = useState(false)

  const handleGetProfile = async () => {
    try {
      setProfileLoading(true)
      await getUserProfile()
    } catch (error) {
      console.error('获取用户信息失败:', error)
    } finally {
      setProfileLoading(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <View className={`bg-white rounded-xl p-4 ${className}`}>
        <View className="text-center">
          <Text className="text-gray-600 mb-4">您还未登录</Text>
          <LoginButton>点击登录</LoginButton>
        </View>
      </View>
    )
  }

  return (
    <View className={`bg-white rounded-xl p-4 ${className}`}>
      <View className="flex items-center mb-4">
        {userInfo?.userInfo?.avatarUrl ? (
          <View className="w-16 h-16 bg-gray-200 rounded-full mr-4">
            {/* 在实际项目中，这里应该是 Image 组件 */}
            <View className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center">
              <Text className="text-blue-600 text-xs">头像</Text>
            </View>
          </View>
        ) : (
          <View className="w-16 h-16 bg-gray-200 rounded-full mr-4 flex items-center justify-center">
            <Text className="text-gray-500 text-xs">未设置</Text>
          </View>
        )}

        <View className="flex-1">
          <Text className="font-semibold text-gray-900 mb-1">
            {userInfo?.userInfo?.nickName || '微信用户'}
          </Text>
          <Text className="text-xs text-gray-500">
            ID: {userInfo?.openid?.substring(0, 8)}...
          </Text>
        </View>
      </View>

      <View className="flex space-x-2">
        {!userInfo?.userInfo && (
          <Button
            className="flex-1 bg-blue-50 text-blue-600 rounded-lg py-2 text-sm"
            onClick={handleGetProfile}
            disabled={profileLoading}
          >
            {profileLoading ? '获取中...' : '获取头像昵称'}
          </Button>
        )}

        <Button
          className="flex-1 bg-red-50 text-red-600 rounded-lg py-2 text-sm"
          onClick={logout}
        >
          退出登录
        </Button>
      </View>
    </View>
  )
}
