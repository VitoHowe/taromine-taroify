import { Tabbar } from '@taroify/core'
import {
  HomeOutlined,
  BookmarkOutlined,
  GiftOutlined,
  UserOutlined
} from '@taroify/icons'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { useTabLoginCheck } from '~/hooks/useAuth'

interface TabBarProps {
  current?: number
  onChange?: (index: number) => void
}

const TabBar: React.FC<TabBarProps> = ({ current = 0, onChange }) => {
  const [activeTab, setActiveTab] = useState(current)
  const { checkLoginOnTabSwitch, isLoading: authLoading } = useTabLoginCheck()

  useEffect(() => {
    setActiveTab(current)
  }, [current])

  const getTabItems = () => [
    {
      icon: <HomeOutlined className={activeTab === 0 ? 'text-blue-600' : 'text-gray-600'} />,
      text: '首页',
      url: '/pages/index/index'
    },
    {
      icon: <BookmarkOutlined className={activeTab === 1 ? 'text-blue-600' : 'text-gray-600'} />,
      text: '知识点',
      url: '/pages/knowledge/index'
    },
    {
      icon: <GiftOutlined className={activeTab === 2 ? 'text-blue-600' : 'text-gray-600'} />,
      text: '练习',
      url: '/pages/practice/index'
    },
    {
      icon: <UserOutlined className={activeTab === 3 ? 'text-blue-600' : 'text-gray-600'} />,
      text: '我的',
      url: '/pages/profile/index'
    }
  ]

  const tabItems = getTabItems()

  const handleTabChange = async (index: number) => {
    if (index === activeTab) return

    // 如果正在进行身份验证，阻止切换
    if (authLoading) {
      console.log('正在验证身份，请稍候...')
      return
    }

    try {
      // 在切换 Tab 前检查登录状态
      const isLoginValid = await checkLoginOnTabSwitch()

      if (!isLoginValid) {
        console.log('登录验证失败，阻止 Tab 切换')
        // 可以选择显示登录提示或保持在当前 Tab
        Taro.showToast({
          title: '登录验证失败',
          icon: 'none',
          duration: 2000
        })
        return
      }

      // 登录验证成功，继续 Tab 切换
      setActiveTab(index)
      onChange?.(index)

      // 页面跳转
      const targetTab = tabItems[index]
      if (targetTab) {
        console.log('准备跳转到:', targetTab.url)
        // 使用 redirectTo 避免页面栈积累
        Taro.redirectTo({
          url: targetTab.url
        }).catch((err) => {
          console.error('页面跳转失败:', err)
        })
      }
    } catch (error) {
      console.error('Tab 切换过程中发生错误:', error)
      Taro.showToast({
        title: '切换失败，请重试',
        icon: 'none'
      })
    }
  }

  return (
    <Tabbar
      value={activeTab}
      onChange={handleTabChange}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg"
      fixed
    >
      {tabItems.map((item, index) => (
        <Tabbar.TabItem
          key={index}
          icon={item.icon}
          value={index}
          className={`transition-all duration-200 ${
            activeTab === index
              ? 'text-blue-600 font-semibold'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {item.text}
        </Tabbar.TabItem>
      ))}
    </Tabbar>
  )
}

export default TabBar
